# 쿼터파이

## Design

+ **UI/UX**
  + 배경에 사용된 색상은 다음과 같습니다.
    + ${\textsf{\colorbox{#232323}{\color{#FAFAFA}Light (250, 250, 250)}}}$
    + ${\textsf{\colorbox{#FAFAFA}{\color{#232323}Dark (35, 35, 35)}}}$
  + 오브젝트에 사용된 색상은 다음과 같습니다.
    + ${\textsf{\colorbox{#FFFFFF}{\color{#000000}Black (0, 0, 0)}}}$
    + ${\textsf{\colorbox{#000000}{\color{#FFFFFF}White (255, 255, 255)}}}$
    + ${\textsf{\color{#8D8D93}Gray (142, 142, 147)}}$
    + ${\textsf{\color{#007AFF}Blue (0, 122, 255)}}$
      + ${\textsf{\color{#0A84FF}Blue(dark) (10, 132, 255)}}$
      + ${\textsf{\color{#0096FF}Blue(hover) (0, 150, 255)}}$
      + ${\textsf{\color{#0AA0FF}Blue(dark hover) (10, 160, 255)}}$

## Source Code

+ Light/Dark transistion

  ```css
  body {
    background-color: #fafafa;
    color: black;
  }

  @media (prefers-color-scheme: dark) {
    body {
          background-color: #232323;
          color: white;
    }
  }
  ```
  
## Credit

+ **color** : [Apple human-interface](https://developer.apple.com/design/human-interface-guidelines/color) *모든 색상을 참고한것은 아님
+ **font** : [**Pretendard**](https://github.com/orioncactus/pretendard) [BR Cobane](https://www.cdnfonts.com/br-cobane.font)
