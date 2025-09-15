// 전역 변수
const AUTH_URL = "https://script.google.com/macros/s/AKfycbwJkCkPJTg2AKKVNncedK7r--Txh9iexICytoDg6ajIpA2vYej7fv7AadCCuhRb9Qs9/exec";
const CHAT_URL = "https://script.google.com/macros/s/AKfycbxxXzzaUsogJ1ZwgQwbfs6jUR9MY0iu51do0PWURuNlusx_Vjp0A3eqjZGFuRzMaVTl/exec";
const hues = {'0':270,'1':292.5,'2':315,'3':337.5,'4':0,'5':22.5,'6':45,'7':67.5,'8':90,'9':112.5,'a':135,'b':147.5,'c':180,'d':202.5,'e':225,'f':247.5};
var storage = {};
var aborts = new Set();

// 캐싱 및 최적화 변수
let messageCache = [];
let lastMessageId = null;
let pollInterval = null;
let isPolling = false;
let pendingRequest = null;

// SHA256 함수 (기존 코드 유지)
function SHA256(data) {
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a,
        h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19,
        tsz = 0, bp = 0;
    const k = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2],
        rrot = (x, n) => (x >>> n) | (x << (32-n)),
        w = new Uint32Array(64),
        buf = new Uint8Array(64),
        process = () => {
            for (let j=0,r=0; j<16; j++,r+=4) {
                w[j] = (buf[r]<<24) | (buf[r+1]<<16) | (buf[r+2]<<8) | buf[r+3];
            }
            for (let j=16; j<64; j++) {
                let s0 = rrot(w[j-15], 7) ^ rrot(w[j-15], 18) ^ (w[j-15] >>> 3);
                let s1 = rrot(w[j-2], 17) ^ rrot(w[j-2], 19) ^ (w[j-2] >>> 10);
                w[j] = (w[j-16] + s0 + w[j-7] + s1) | 0;
            }
            let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
            for (let j=0; j<64; j++) {
                let S1 = rrot(e, 6) ^ rrot(e, 11) ^ rrot(e, 25),
                ch = (e & f) ^ ((~e) & g),
                t1 = (h + S1 + ch + k[j] + w[j]) | 0,
                S0 = rrot(a, 2) ^ rrot(a, 13) ^ rrot(a, 22),
                maj = (a & b) ^ (a & c) ^ (b & c),
                t2 = (S0 + maj) | 0;
                h = g; g = f; f = e; e = (d + t1)|0; d = c; c = b; b = a; a = (t1 + t2)|0;
            }
            h0 = (h0 + a)|0; h1 = (h1 + b)|0; h2 = (h2 + c)|0; h3 = (h3 + d)|0;
            h4 = (h4 + e)|0; h5 = (h5 + f)|0; h6 = (h6 + g)|0; h7 = (h7 + h)|0;
            bp = 0;
        },
        add = data => {
            data = typeof TextEncoder === "undefined" ? Buffer.from(data) : (new TextEncoder).encode(data);
            for (let i=0; i<data.length; i++) {
                buf[bp++] = data[i];
                if (bp === 64) process();
            }
            tsz += data.length;
        },
        digest = () => {
            buf[bp++] = 0x80; if (bp == 64) process();
            if (bp + 8 > 64) {
                while (bp < 64) buf[bp++] = 0x00;
                process();
            }
            while (bp < 58) buf[bp++] = 0x00;
            let L = tsz * 8;
            buf[bp++] = (L / 1099511627776.) & 255;
            buf[bp++] = (L / 4294967296.) & 255;
            buf[bp++] = L >>> 24;
            buf[bp++] = (L >>> 16) & 255;
            buf[bp++] = (L >>> 8) & 255;
            buf[bp++] = L & 255;
            process();
            let reply = new Uint8Array(32);
            reply[ 0] = h0 >>> 24; reply[ 1] = (h0 >>> 16) & 255; reply[ 2] = (h0 >>> 8) & 255; reply[ 3] = h0 & 255;
            reply[ 4] = h1 >>> 24; reply[ 5] = (h1 >>> 16) & 255; reply[ 6] = (h1 >>> 8) & 255; reply[ 7] = h1 & 255;
            reply[ 8] = h2 >>> 24; reply[ 9] = (h2 >>> 16) & 255; reply[10] = (h2 >>> 8) & 255; reply[11] = h2 & 255;
            reply[12] = h3 >>> 24; reply[13] = (h3 >>> 16) & 255; reply[14] = (h3 >>> 8) & 255; reply[15] = h3 & 255;
            reply[16] = h4 >>> 24; reply[17] = (h4 >>> 16) & 255; reply[18] = (h4 >>> 8) & 255; reply[19] = h4 & 255;
            reply[20] = h5 >>> 24; reply[21] = (h5 >>> 16) & 255; reply[22] = (h5 >>> 8) & 255; reply[23] = h5 & 255;
            reply[24] = h6 >>> 24; reply[25] = (h6 >>> 16) & 255; reply[26] = (h6 >>> 8) & 255; reply[27] = h6 & 255;
            reply[28] = h7 >>> 24; reply[29] = (h7 >>> 16) & 255; reply[30] = (h7 >>> 8) & 255; reply[31] = h7 & 255;
            reply.hex = () => {
                let res = "";
                reply.forEach(x => res += ("0" + x.toString(16)).slice(-2));
                return res;
            };
            return reply;
        };
    add(data);
    return digest().hex();
}

// 로그인 관련 함수들 (기존 코드 유지)
function initializeUserData() {
  try {
    const savedData = localStorage.getItem('chatApp_userData');
    if (savedData) {
      const userData = JSON.parse(savedData);
      if (userData.timestamp && (Date.now() - userData.timestamp) < 24 * 60 * 60 * 1000) {
        storage = { ...userData };
        console.log('로그인 정보 복원됨:', storage.name);
        return true;
      } else {
        console.log('저장된 로그인 정보가 만료됨');
        localStorage.removeItem('chatApp_userData');
      }
    }
  } catch (error) {
    console.error('로그인 정보 로드 실패:', error);
    localStorage.removeItem('chatApp_userData');
  }
  return false;
}

const hasStoredLogin = initializeUserData();

function loadUserData() {
  return initializeUserData();
}

function saveUserData() {
  try {
    const dataToSave = {
      ...storage,
      timestamp: Date.now()
    };
    localStorage.setItem('chatApp_userData', JSON.stringify(dataToSave));
    console.log('로그인 정보 저장됨:', storage.name);
  } catch (error) {
    console.error('로그인 정보 저장 실패:', error);
  }
}

function updateLoginUI() {
  const loginButton = document.querySelector(".g_id_signin");
  const loginMockup = document.querySelector("#login-mockup");
  const pfpImg = document.querySelector(".pfp");
  
  if (storage.sub) {
    console.log('로그인 상태로 UI 업데이트');
    if (loginButton) loginButton.style.visibility = "hidden";
    if (loginMockup) loginMockup.style.display = "flex";
    if (pfpImg) {
      pfpImg.style.visibility = "visible";
      if (storage.pfp) {
        pfpImg.src = storage.pfp;
      }
    }
  } else {
    console.log('로그아웃 상태로 UI 업데이트');
    if (loginButton) loginButton.style.visibility = "visible";
    if (loginMockup) loginMockup.style.display = "none";
    if (pfpImg) pfpImg.style.visibility = "hidden";
  }
}

function initializeUI() {
  updateLoginUI();
  if (window.updateLoginStatus) {
    window.updateLoginStatus(!!storage.sub);
  }
}

function logout() {
  console.log('로그아웃 실행');
  storage = {};
  localStorage.removeItem('chatApp_userData');
  updateLoginUI();
  location.reload();
}

async function handleCredentialResponse(response) {
  const idToken = response.credential;
  console.log('Google 로그인 시도');
  
  const loginButton = document.querySelector(".g_id_signin");
  const loginMockup = document.querySelector("#login-mockup");
  
  if (loginButton) loginButton.style.visibility = "hidden";
  if (loginMockup) loginMockup.style.display = "flex";
  
  try {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ idToken })
    });

    const data = await res.json();
    if (!data.success) {
      console.error(`로그인 실패: ${JSON.stringify(data)}`);
      updateLoginUI();
      return;
    }
    
    console.log('로그인 성공:', data);
    
    storage.sub = data.sub;
    storage.name = data.name;
    storage.authdate = data.date;
    storage.auth = data.auth;
    storage.pfp = data.pfp;
    
    saveUserData();
    updateLoginUI();
    
    if (window.updateLoginStatus) {
      window.updateLoginStatus(true);
    }
    
  } catch (error) {
    console.error('로그인 오류:', error);
    updateLoginUI();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 로드 완료, UI 초기화');
  initializeUI();
});

window.addEventListener('load', () => {
  setTimeout(() => {
    console.log('페이지 로드 완료, UI 재확인');
    initializeUI();
  }, 100);
});

// React 컴포넌트
const { useEffect, useState, useRef, useMemo, useCallback } = React;

// 마크다운 렌더러 설정 (캐싱)
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
  const link = marked.Renderer.prototype.link.call(this, href, title, text);
  return link.replace('<a', '<a target="_blank" rel="noopener noreferrer" ');
};

marked.setOptions({
  renderer: renderer,
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false,
});

// 마크다운 렌더링 캐시
const markdownCache = new Map();
const renderMarkdown = (content) => {
  if (markdownCache.has(content)) {
    return markdownCache.get(content);
  }
  const rendered = DOMPurify.sanitize(marked.parse(content));
  markdownCache.set(content, rendered);
  return rendered;
};

function ChatApp() {
  // 유틸리티 함수들 (메모이제이션)
  const getSeoulNow = useCallback(() => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })), []);
  const formatTime = useCallback((date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }, []);

  // 상태 관리
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(hasStoredLogin);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // 전역 함수 등록
  useEffect(() => {
    window.updateLoginStatus = (status) => {
      console.log('React 컴포넌트 로그인 상태 업데이트:', status);
      setIsLoggedIn(status);
    };
    
    return () => {
      window.updateLoginStatus = null;
    };
  }, []);

  // 로그인 상태 체크 (최적화: 3초마다)
  useEffect(() => {
    const checkLoginStatus = () => {
      const currentLoginState = !!storage.sub;
      if (currentLoginState !== isLoggedIn) {
        console.log('로그인 상태 변경 감지:', currentLoginState);
        setIsLoggedIn(currentLoginState);
      }
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 3000); // 3초로 늘림
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // 자동 스크롤 (최적화)
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);
  
  // 입력창 높이 자동 조절 (디바운싱)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 150;
        
        if (scrollHeight > maxHeight) {
          textarea.style.height = `${maxHeight}px`;
          textarea.style.overflowY = 'auto';
        } else {
          textarea.style.height = `${scrollHeight}px`;
          textarea.style.overflowY = 'hidden';
        }
      }
    }, 10);

    return () => clearTimeout(timeout);
  }, [newMessage]);

  // 스마트 폴링 (활성 상태에 따라 주기 조절)
  useEffect(() => {
    let pollTimeout;
    let isActive = true;

    const startPolling = () => {
      if (!isActive) return;
      
      const interval = document.hidden ? 10000 : 5000; // 백그라운드일 때 더 느리게
      
      pollTimeout = setTimeout(async () => {
        if (!isSending && isActive) {
          await fetchMessages();
        }
        startPolling();
      }, interval);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && isActive) {
        fetchMessages(); // 포그라운드로 돌아올 때 즉시 새로고침
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startPolling();

    return () => {
      isActive = false;
      if (pollTimeout) clearTimeout(pollTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSending]);

  // 초기 메시지 로드
  useEffect(() => {
    fetchMessages();
  }, []);

  // 메시지 가져오기 (최적화)
  const fetchMessages = useCallback(async () => {
    // 중복 요청 방지
    if (pendingRequest) {
      return pendingRequest;
    }

    if (aborts.size > 0) return;
    
    const ctrl = new AbortController();
    const signal = ctrl.signal;
    aborts.add(ctrl);

    pendingRequest = fetch(CHAT_URL, {
      signal,
      method: "GET",
      redirect: "follow"
    }).then(async (response) => {
      const data = await response.text();
      const parsedMessages = JSON.parse(data).map((e) => ({
        id: e[0],
        sub: e[1], 
        name: e[2],
        content: e[3],
        timestamp: e[0],
        replyToId: e[4] || null,
      }));

      // 메시지가 실제로 변경되었을 때만 업데이트
      const newLastMessageId = parsedMessages.length > 0 ? parsedMessages[parsedMessages.length - 1].id : null;
      if (newLastMessageId !== lastMessageId || parsedMessages.length !== messageCache.length) {
        setMessages(parsedMessages);
        messageCache.length = 0;
        messageCache.push(...parsedMessages);
        lastMessageId = newLastMessageId;
      }

      setIsLoading(false);
    }).catch((error) => {
      if (!signal.aborted) {
        console.error('메시지 로드 오류:', error);
      }
    }).finally(() => {
      aborts.delete(ctrl);
      pendingRequest = null;
    });

    return pendingRequest;
  }, []);

  // 메시지 전송 (최적화)
  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;
    
    if (!storage.sub) {
      setError("구글 계정으로 로그인해주세요.");
      return;
    }

    setError("");
    setIsSending(true);

    const data = {
      contents: newMessage.trim(),
      sub: storage.sub,
      name: storage.name,
      authdate: storage.authdate,
      auth: storage.auth,
      replyToId: replyingToMessage ? replyingToMessage.id : null,
    };

    const tempMessage = {
      id: Date.now(),
      sub: storage.sub,
      name: storage.name,
      content: newMessage.trim(),
      timestamp: Date.now(),
      isTemp: true,
      replyToId: replyingToMessage ? replyingToMessage.id : null,
    };

    // 낙관적 업데이트
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");
    setReplyingToMessage(null);

    // 기존 요청들 중단
    for (const controller of aborts) {
      controller.abort();
    }

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      
      const updateMessagesFromServer = (serverData) => {
        const serverMessages = JSON.parse(serverData).map((e) => ({
          id: e[0], sub: e[1], name: e[2], content: e[3], timestamp: e[0], 
          replyToId: e[4] || null,
        }));
        setMessages(serverMessages);
        messageCache.length = 0;
        messageCache.push(...serverMessages);
        lastMessageId = serverMessages.length > 0 ? serverMessages[serverMessages.length - 1].id : null;
      };

      if (result.startsWith("fail")) {
        const msg = result.substring(6).split("\n");
        setError(msg[0]);
        setMessages(prev => prev.filter(m => !m.isTemp));
        if (msg.length >= 2) {
          updateMessagesFromServer(msg[1]);
        }
      } else {
        updateMessagesFromServer(result);
      }

    } catch (error) {
      console.error('메시지 전송 오류:', error);
      setError("메시지 전송에 실패했어요.");
      setMessages(prev => prev.filter(m => !m.isTemp));
    } finally {
      setIsSending(false);
    }
  }, [newMessage, isSending, replyingToMessage]);

  // 메시지 삭제 (최적화)
  const deleteMessage = useCallback(async (messageId) => {
    if (!storage.sub) return;
    const data = {
      studentId: "DELETE", key: messageId, sub: storage.sub, name: storage.name,
      authdate: storage.authdate, auth: storage.auth
    };
    try {
      const response = await fetch(CHAT_URL, {
        method: "POST", redirect: "follow", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
      const result = await response.text();

      const updateMessagesFromServer = (serverData) => {
        const serverMessages = JSON.parse(serverData).map((e) => ({
          id: e[0], sub: e[1], name: e[2], content: e[3], timestamp: e[0], 
          replyToId: e[4] || null,
        }));
        setMessages(serverMessages);
        messageCache.length = 0;
        messageCache.push(...serverMessages);
        lastMessageId = serverMessages.length > 0 ? serverMessages[serverMessages.length - 1].id : null;
      };

      if (result.startsWith("fail")) {
        const msg = result.substring(6).split("\n");
        setError(msg[0]);
        if (msg.length >= 2) updateMessagesFromServer(msg[1]);
      } else {
        updateMessagesFromServer(result);
      }

    } catch (error) {
      console.error('메시지 삭제 오류:', error);
      setError("메시지 삭제에 실패했어요.");
    }
  }, []);
  
  // 키보드 입력 핸들러
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  }, [sendMessage]);

  // 답장할 메시지 설정
  const handleSetReply = useCallback((message) => {
    setReplyingToMessage(message);
    textareaRef.current?.focus();
  }, []);

  // 원본 메시지로 스크롤
  const scrollToMessage = useCallback((messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight');
      setTimeout(() => {
        element.classList.remove('highlight');
      }, 1500);
    }
  }, []);

  // 메시지 렌더링 최적화
  const renderMessage = useCallback((message, index) => {
    if (message.sub === "-1") {
      return (
        <div key={message.id} className="text-center my-2">
          <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full px-3 py-1">
            삭제된 메시지입니다.
          </span>
        </div>
      );
    }
    
    const originalMessage = message.replyToId ? messages.find(m => m.id == message.replyToId) : null;
    const showAvatar = index === 0 || messages[index - 1]?.sub !== message.sub;
    const showTime = index === messages.length - 1 || 
      messages[index + 1]?.sub !== message.sub ||
      (formatTime(messages[index + 1]?.timestamp) != formatTime(message.timestamp))
    
    return (
      <div key={message.id} id={`message-${message.id}`}>
        <div className={`flex gap-2 ${message.sub === storage.sub ? 'flex-row-reverse' : 'flex-row'} ${message.isTemp ? 'opacity-60' : ''}`}>
          <div className={`flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}>
            {message.sub !== storage.sub && (
              <div className={`user-avatar`} style={{ "--hue": hues[SHA256(message.sub+"salt1")[0]]}}>
                {message.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          
          <div className={`flex flex-col flex-message ${message.sub === storage.sub ? 'items-end' : 'items-start'}`}>
            {showAvatar && message.sub !== storage.sub && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                {message.name}
              </div>
            )}
            
            <div className="group relative">
              <div className={message.sub === storage.sub ? 'chat-bubble-right' : 'chat-bubble-left'}>
                {originalMessage && (
                  <div
                    className="reply-preview"
                    onClick={() => scrollToMessage(originalMessage.id)}
                  >
                    <div className="font-semibold text-xs">{originalMessage.name}</div>
                    <div className="text-xs opacity-80 truncate">{originalMessage.content}</div>
                  </div>
                )}
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(message.content)
                  }}
                />
              </div>

              {message.sub !== -1 && (
                <div className={`absolute top-1 ${message.sub === storage.sub ? 'right-1' : 'left-1'}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMessages(prev =>
                        prev.map(m =>
                          m.id === message.id ? { ...m, showMenu: !m.showMenu } : { ...m, showMenu: false }
                        )
                      );
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >⋮</button>

                  {message.showMenu && (
                    <div className={`popup-menu absolute mt-1 w-28 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 ${message.sub === storage.sub ? 'right-0' : 'left-0'}`}>
                      {message.sub === storage.sub && (
                        <>
                          <button onClick={() => deleteMessage(message.id)} className="popup-menu-item text-red-500">삭제</button>
                          <button onClick={() => alert("수정 기능 준비 중")} className="popup-menu-item">수정</button>
                        </>
                      )}
                      <button onClick={() => handleSetReply(message)} className="popup-menu-item">답장</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {showTime && (
              <div className={`text-xs text-gray-400 mt-1 ${message.sub === storage.sub ? 'mr-1' : 'ml-1'}`}>
                {formatTime(message.timestamp)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [messages, formatTime, scrollToMessage, deleteMessage, handleSetReply]);

  // 메모이제이션된 메시지 리스트
  const memoizedMessages = useMemo(() => {
    return messages.map(renderMessage);
  }, [messages, renderMessage]);

  // 렌더링
  return (
    <div className="chat-container flex flex-col min-h-full">
      {/* 로그인 안내 */}
      {!isLoggedIn && (
        <div className="mx-3 sm:mx-4 mt-3 sm:mt-4 mb-2 px-3 sm:px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-600 dark:text-blue-400 text-xs sm:text-sm text-center">
          구글로 로그인해 채팅을 시작하세요.
        </div>
      )}

      {/* 채팅 메시지 영역 */}
      <div className="chat-messages flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400 text-sm">메시지를 불러오는 중...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="text-3xl sm:text-4xl mb-3">💬</div>
            <div className="text-xs sm:text-sm text-center px-4">
              {isLoggedIn ? "첫 메시지를 보내보세요" : "로그인 후 채팅을 시작할 수 있습니다"}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {memoizedMessages}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mx-3 sm:mx-4 mb-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}
      
      {/* 메시지 입력 영역 */}
      <div className="sticky bottom-0 mt-auto w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        {replyingToMessage && (
          <div className="reply-input-preview">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold">Replying to {replyingToMessage.name}</div>
              <p className="text-xs truncate">{replyingToMessage.content}</p>
            </div>
            <button onClick={() => setReplyingToMessage(null)} className="p-1">&times;</button>
          </div>
        )}
        <div className="px-3 sm:px-4 py-3">
          <form onSubmit={sendMessage} className="flex items-center gap-2 sm:gap-3">
            <textarea
              ref={textareaRef} 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown} 
              placeholder={isLoggedIn ? "메시지를 입력하세요..." : "로그인 후 메시지를 보낼 수 있어요."}
              className="message-input" 
              disabled={!isLoggedIn} 
              maxLength="500" 
              rows="1" 
              style={{ resize: 'none' }}
            />
            <button type="submit" className="send-button" disabled={isSending || !newMessage.trim() || !isLoggedIn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// React 앱 렌더링
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ChatApp />);