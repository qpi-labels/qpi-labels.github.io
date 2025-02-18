### 쿼터파이

### Design
+ **UI/UX**
  + 배경에 사용된 색상은 다음과 같습니다.
    + ${\textsf{\color{rgb(250, 250, 250)}Light (250, 250, 250)}}$
    + ${\textsf{\color{rgb(18, 18, 18)}Dark (18, 18, 18)}}$
  + 오브젝트에 사용된 색상은 다음과 같습니다.
    + ${\textsf{\color{rgb(0, 0, 0)}BLACK (0, 0, 0)}}$
    + ${\textsf{\color{rgb(142, 142, 147)}GRAY (142, 142, 147)}}$
    + ${\textsf{\color{rgb(0, 122, 255)}BLUE (0, 122, 255)}}$
      
### Source Code

+ **button**
  ![hover](https://github.com/qpi-labels/qpi-labels.github.io/blob/cf5ccdca1aae841e1974f232eabb6522db81e396/image%20source/hover.gif)
  ```
     <style>
        .access-button {
            background-color: rgb(0, 122, 255); //Apple human-interface 'blue' color
            color: #fff;
            border: none;
            padding: 18px 40px;
            border-radius: 36px;
            font-size: large;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
            transition: transform 0.2s ease-out, background-color 0.3s ease;
        }
        .access-button:hover {
            background-color: rgb(0, 150, 255);
            transform: scale(1.05);
        }
     </style>
  ```
  ```
    <body>
      <div class="button-container">
          <button class="access-button" onclick="window.location.href='링크'">더 알아보기</button>
      </div>
    </body>
  ```
+ Light/Dark transistion
  ```
    @media (prefers-color-scheme: dark) {
      body {
            background-color: #121212;
            color: white;
      }
      .access-button {
            background-color: rgb(10, 132, 255);
            box-shadow: none;
      }
      .access-button:hover {
            background-color: rgb(10, 160, 255);
            box-shadow: none;
      }
        }
  ```
  
### Credit
+ **color** : [Apple human-interface](https://developer.apple.com/design/human-interface-guidelines/color) *모든 색상을 참고한것은 아님
+ **font** : [**Pretendard**](https://github.com/orioncactus/pretendard) [Gmarket Sans](https://corp.gmarket.com/fonts/)
