const { useEffect, useState } = React;

// JS에는 해시를 구할 수 있는 crypto.subtle.digest라는 내장 함수가 있으나, async이다. JS에서는 async를 다시 sync로 돌리는 방법이 없다.
// ㅁㅈ도래ㅗ먀지ㅏ루ㅗㅕㅑㅁㄹㄷ지ㅜㅗㅕ탸로ㅕㅁㄴ
// 아 혹시 있으면 나한테 말해주기 바란다.
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
            // Max number of bytes is 35,184,372,088,831
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

const URL = "https://script.google.com/macros/s/AKfycbxxXzzaUsogJ1ZwgQwbfs6jUR9MY0iu51do0PWURuNlusx_Vjp0A3eqjZGFuRzMaVTl/exec"
var aborts = new Set();

function StudyCafeReservation() {
    const getSeoulNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const formatYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
    };

    const [now, setNow] = useState(getSeoulNow());

    useEffect(() => {
    const t = setInterval(() => setNow(getSeoulNow()), 1000);
    return () => clearInterval(t);
    }, []);

    const [listLoading, setListLoading] = useState(true);
    const [list, setList] = useState([]);

    const [fetching, setFetching] = useState(true);
    const [lastReload, setLastReload] = useState(new Date(0));
    useEffect(() => {
    if (!fetching || aborts.size!=0) return;
    if (getSeoulNow()-lastReload < 4000) return;
    const ctrl = new AbortController();
    const signal = ctrl.signal;
    aborts.add(ctrl);
    fetch(URL, {
        signal,
        method: "GET",
        redirect: "follow"
    })
    .then(response => response.text())
    .catch(error => {
        if (signal.aborted) {
        console.log("aborted");
        return Promise.reject("nope");
        }
        console.error('Error:', error);
        return [];
    })
    .then((data) => {
        setList(JSON.parse(data).map((e) => ({date: e[0], sub: e[1], name: e[2], contents: e[3]})));
        setListLoading(false);
        console.log("init start")
    })
    .catch(_ => Promise.resolve("this is fine"))
    .finally(() => {
        setLastReload(getSeoulNow());
        aborts.delete(ctrl)
    });
    })

    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [ok, setOk] = useState("");
    const [progress, setProgress] = useState("");

    const handleReserve = (e) => {
    e.preventDefault();
    if (!fetching) return;
    setError("");
    setOk("");
    setProgress("");
    
    if (storage.sub == null) {
        setError("우상단의 버튼을 눌러 구글 계정으로 로그인하세요.");
        return;
    }

    if (!name.trim()) {
        setError("내용을 입력해 주세요.");
        return;
    }

    setProgress("잠시 기다려 주세요...")
    
    const data = {
        contents: name.trim(),
        sub: storage.sub,
        name: storage.name,
        authdate: storage.authdate,
        auth: storage.auth
    };
    
    setFetching(false);
    for (e of aborts) {
        e.abort();
    }
    fetch(URL, {
        method: "POST",
        redirect: "follow",
        headers: {
        "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
    }).then(response => response.text())
    .then(result => {
        setProgress("");
        setFetching(true);
        if (result.startsWith("fail")) {
        let msg = result.substring(6).split("\n");
        setError(msg[0]); // fail: [실패사유]
        if (msg.length < 2) return;
        setList(JSON.parse(msg[1]).map((e) => ({date: e[0], sub: e[1], name: e[2], contents: e[3]})));
        return;
        }
        setList(JSON.parse(result).map((e) => ({date: e[0], sub: e[1], name: e[2], contents: e[3]})));
        setName("");
        setOk("글을 작성했어요.");
    })
    .catch(error => console.error('Error:', error));
    }

    const handleDeletion = (key) => {
    if (!fetching) return;
    if (storage.sub == null) {
        setError("구글 계정으로 로그인 한 뒤 다시 시도해 주세요.");
        return;
    }
    
    setError("");
    setOk("");
    setProgress("잠시 기다려 주세요...");
    
    const data = {
        studentId: "DELETE",
        key: key,
        sub: storage.sub,
        authdate: storage.authdate,
        auth: storage.auth
    };
    
    setFetching(false);
    for (const e of aborts) {
        e.abort();
    }
    fetch(URL, {
        method: "POST",
        redirect: "follow",
        headers: {
        "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
    }).then(response => response.text())
    .then(result => {
        setFetching(true);
        setProgress("");
        if (result.startsWith("fail")) {
            let msg = result.substring(6).split("\n");
            setError(msg[0]); // fail: [실패사유]
            if (msg.length < 2) return;
            setList(JSON.parse(msg[1]).map((e) => ({date: e[0], sub: e[1], name: e[2], contents: e[3]})));
            return;
        }
        setList(JSON.parse(result).map((e) => ({date: e[0], sub: e[1], name: e[2], contents: e[3]})));
        setOk("글을 삭제했어요.");
    })
    .catch(error => console.error('Error:', error));
    }

    const time = () => `${getSeoulNow().getHours().toString().padStart(2, "0")}:${getSeoulNow().getMinutes().toString().padStart(2, "0")}:${getSeoulNow().getSeconds().toString().padStart(2, "0")}`;

    const container = "max-w-3xl mx-auto px-6";
    const glass = "backdrop-blur-xl bg-white/70 dark:bg-[#232323]/70 border border-neutral-200 dark:border-neutral-700 rounded-[42px] shadow-lg";
    const btnBase = "rounded-[16px] px-5 py-3 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
    const btnPrimary = btnBase + " bg-black text-white dark:bg-neutral-50 dark:text-neutral-950 hover:bg-black/90 hover:dark:bg-neutral-50/90 active:scale-[0.99]";
    const inputBase = "w-full rounded-[16px] border border-neutral-300 dark:border-neutral-600 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-neutral-200 transition bg-white dark:bg-neutral-950";

    const len = list.length;
    const dayprogress = (Date.now() - new Date().setHours(0,0,0,0)) / 86400000;

    return (
    <div>
        <section className={container + " mt-16 pt-14 pb-10"}>
        <div className="flex flex-col items-start gap-6">
            <h1 className="text-4xl md:text-6xl leading-tight tracking-tight font-semibold">
            레드불 <span className="inline-block bg-black text-white dark:bg-neutral-50 dark:text-neutral-950 px-2 rounded-xl">계시판</span>
            <br/> 신의 게시
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300 text-lg md:text-xl font-semibold">
            죄송<strong>합</strong>니다
            </p>
        </div>
        </section>
        
        <section className={container + " pb-16"}>
        <div className={glass + " p-6 md:p-8"}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
                <div className="text-sm text-neutral-500 dark:text-neutral-300">오늘 날짜</div>
                <div className="text-2xl font-medium">{formatYMD(now)}</div>
            </div>
            <div className="text-right">
                {listLoading ? (
                    <div className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-50 dark:bg-[#232323] pl-1 pr-2 py-1 text-neutral-700 dark:text-neutral-400 tabular-nums">
                    <div className="w-6 h-6 rounded-full circle circle-gray" style={{background: `conic-gradient(var(--color-fg) 0deg ${(dayprogress)*360}deg, var(--color-bg) ${(dayprogress)*360}deg 360deg)`}}/>
                    {time()}
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1 rounded-full border border-green-600/20 bg-green-50 dark:bg-green-950 pl-1 pr-2 py-1 text-green-700 dark:text-green-400 tabular-nums">
                    <div className="w-6 h-6 rounded-full circle circle-green" style={{background: `conic-gradient(var(--color-fg) 0deg ${(dayprogress)*360}deg, var(--color-bg) ${(dayprogress)*360}deg 360deg)`}}/>
                    {time()}
                    </div>
                )}
            </div>
            </div>

            <div className="mt-4 w-full">
            <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-300 mb-1">
                <span>글 수</span>
                <span className="font-semibold">{len}</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-green-500 dark:bg-green-400 transition-[width,background-color] duration-500"
                    style={{ width: `${listLoading?0:100}%` }}
                />
            </div>
            </div>

            <form onSubmit={handleReserve} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
                className={inputBase + " col-span-1 md:col-span-3"}
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="이름"
            />
            <button
                className={btnPrimary}
                type="submit"
            >
                글 쓰기
            </button>
            </form>

            {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-950 px-4 py-3 text-red-700 dark:text-red-400 text-sm">{error}</div>
            )}
            {ok && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950 px-4 py-3 text-emerald-700 dark:text-emerald-400 text-sm">{ok}</div>
            )}
            {progress && (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-950 px-4 py-3 text-orange-700 dark:text-orange-400 text-sm">{progress}</div>
            )}
            
            <div className="mt-10">
            <div className="flex items-end justify-between">
                <h2 className="text-xl font-semibold tracking-tight">글 목록</h2>
                <div className="text-xs text-neutral-500 dark:text-neutral-300">최신순 정렬</div>
            </div>
                <ol className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden">
                    {listLoading ? (
                    <li className="p-4 text-neutral-500 dark:text-neutral-300 text-sm">불러오는 중...</li>
                    ) : (len === 0 && (
                    <li className="p-4 text-neutral-500 dark:text-neutral-300 text-sm">아직 글이 없어요.</li>
                    ))}
                    {list.toReversed().map((r, idx) => (
                    <li key={r.date} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                        <span className="inline-flex w-7 h-7 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-sm">
                            {len - idx}
                        </span>
                        <div>
                            {r.sub==-1 ? (
                                <div className="text-neutral-500 dark:text-neutral-300">삭제됨</div>
                            ) : (
                                <div className="font-medium">{r.contents}</div>
                            )}
                            <div className="text-xs text-neutral-500 dark:text-neutral-300">{r.name}</div>
                        </div>
                        </div>
                        <div className="flex gap-2">
                        {
                            (r.sub!=null && r.sub==storage.sub) && (
                            <button className="inline-block text-xs text-red-500 dark:text-red-600" onClick={() => handleDeletion(r.date)}>
                                삭제
                            </button>
                            )
                        }
                        <div className="inline-block text-xs text-neutral-500 dark:text-neutral-300 tabular-nums">
                            {new Date(r.date).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "2-digit", day: "2-digit", hourCycle: "h23", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </div>
                        </div>
                    </li>
                    ))}
                </ol>
            </div>
        </div>
        </section>

        <footer className="border-t border-neutral-200/60 dark:border-neutral-700/60">
        <div className={container + " py-10 text-sm text-neutral-500 flex flex-col md:flex-row gap-4 md:items-center md:justify-between"}>
            <div>© {now.getFullYear()} QPI <span className="font-br-cobane">BY QPI</span></div>
            <div className="opacity-80">QPIQPIQPI  QPI QPI QPI  QPIQPIQPI</div>
        </div>
        </footer>
    </div>
    );
}
        
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<StudyCafeReservation />);
