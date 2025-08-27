# 쿼터파이

## Design

+ **UI/UX**
  + 배경에 사용된 색상은 다음과 같습니다.
    + Light $\textsf{\color{#bbbbbb}{rgb(250, 250, 250)}}$
    + Dark $\textsf{\color{#232323}{rgb(35, 35, 35)}}$
  + 오브젝트에 사용된 색상은 다음과 같습니다.
    + Black $\textsf{rgb(0, 0, 0)}$
    + White $\textsf{\color{#bbbbbb}{rgb(255, 255, 255)}}$
    + Gray $\textsf{\color{rgb(142,142,147)}{rgb(142, 142, 147)}}$
    + Blue $\textsf{\color{rgb(0,122,255)}{rgb(0, 122, 255)}}$
      + Blue(dark) $\textsf{\color{rgb(10,132,255)}{rgb(10, 132, 255)}}$
      + Blue(hover) $\textsf{\color{rgb(0,150,255)}{rgb(0, 150, 255)}}$
      + Blue(dark hover) $\textsf{\color{rgb(10,160,255)}{rgb(10, 160, 255)}}$

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
