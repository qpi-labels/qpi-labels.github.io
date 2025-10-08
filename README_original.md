# 쿼터파이

## Design

### Colors

+ 사용된 색상은 다음과 같습니다.

  |  | 라이트 모드  | 다크 모드 |
  | --- | --- | --- |
  | bg | `rgb(250,250,250)` $\textsf{\color{rgb(250,250,250)}{■}}$ | `rgb(35,35,35)` $\textsf{\color{rgb(35,35,35)}{■}}$ |
  | text | `rgb(28,28,30)` $\textsf{\color{rgb(28,28,30)}{■}}$ | `rgb(250,250,250)` $\textsf{\color{rgb(250,250,250)}{■}}$ |
  | gray1 | `rgb(229,229,234)` $\textsf{\color{rgb(229,229,234)}{■}}$ | `rgb(58,58,60)` $\textsf{\color{rgb(58,58,60)}{■}}$ |
  | gray2 | `rgb(199,199,204)` $\textsf{\color{rgb(199,199,204)}{■}}$ | `rgb(72,72,74)` $\textsf{\color{rgb(72,72,74)}{■}}$ |
  | gray3 | `rgb(174,174,178)` $\textsf{\color{rgb(174,174,178)}{■}}$ | `rgb(99,99,102)` $\textsf{\color{rgb(99,99,102)}{■}}$ |
  | gray4 | `rgb(142,142,147)` $\textsf{\color{rgb(142,142,147)}{■}}$ | `rgb(142,142,147)` $\textsf{\color{rgb(142,142,147)}{■}}$ |
  | gray5 | `rgb(99,99,102)` $\textsf{\color{rgb(99,99,102)}{■}}$ | `rgb(174,174,178)` $\textsf{\color{rgb(174,174,178)}{■}}$ |
  | gray6 | `rgb(72,72,74)` $\textsf{\color{rgb(72,72,74)}{■}}$ | `rgb(199,199,204)` $\textsf{\color{rgb(199,199,204)}{■}}$ |
  | gray7 | `rgb(58,58,60)` $\textsf{\color{rgb(58,58,60)}{■}}$ | `rgb(229,229,234)` $\textsf{\color{rgb(229,229,234)}{■}}$ |
  | blue | `rgb(0,122,255)` $\textsf{\color{rgb(0,122,255)}{■}}$ | `rgb(10,132,255)` $\textsf{\color{rgb(10,132,255)}{■}}$ |
  | blue-active | `rgb(0,150,255)` $\textsf{\color{rgb(0,150,255)}{■}}$ | `rgb(10,160,255)` $\textsf{\color{rgb(10,160,255)}{■}}$ |

  $\textsf{\color{rgb(250,250,250)}{■}}$ $\textsf{\color{rgb(28,28,30)}{■}}$ $\textsf{\color{rgb(229,229,234)}{■}}$ $\textsf{\color{rgb(199,199,204)}{■}}$ $\textsf{\color{rgb(174,174,178)}{■}}$ $\textsf{\color{rgb(142,142,147)}{■}}$ $\textsf{\color{rgb(99,99,102)}{■}}$ $\textsf{\color{rgb(72,72,74)}{■}}$ $\textsf{\color{rgb(58,58,60)}{■}}$ $\textsf{\color{rgb(0,122,255)}{■}}$ $\textsf{\color{rgb(0,150,255)}{■}}$

  $\textsf{\color{rgb(35,35,35)}{■}}$ $\textsf{\color{rgb(250,250,250)}{■}}$ $\textsf{\color{rgb(58,58,60)}{■}}$ $\textsf{\color{rgb(72,72,74)}{■}}$ $\textsf{\color{rgb(99,99,102)}{■}}$ $\textsf{\color{rgb(142,142,147)}{■}}$ $\textsf{\color{rgb(174,174,178)}{■}}$ $\textsf{\color{rgb(199,199,204)}{■}}$ $\textsf{\color{rgb(229,229,234)}{■}}$ $\textsf{\color{rgb(10,132,255)}{■}}$ $\textsf{\color{rgb(10,160,255)}{■}}$

+ Light/Dark transistion

  ```css
  :root {
    --c-bg: rgb(250 250 250);
    --c-antibg: rgb(35 35 35);
    --c-text: rgb(28 28 30);
    --c-antitext: rgb(250 250 250);
    --c-gray1: rgb(229 229 234);
    --c-gray2: rgb(199 199 204);
    --c-gray3: rgb(174 174 178);
    --c-gray4: rgb(142 142 147);
    --c-gray5: rgb(99 99 102);
    --c-gray6: rgb(72 72 74);
    --c-gray7: rgb(58 58 60);
    --c-blue: rgb(0 122 255);
    --c-blue-active: rgb(0 150 255);
    --c-antiblue: rgb(10 132 255);
    --c-antiblue-active: rgb(10 160 255);

    --c-lbg: rgb(250 250 250);
    --c-dbg: rgb(35 35 35);
    --c-ltext: rgb(250 250 250);
    --c-dtext: rgb(28 28 30);
    --c-grayl3: rgb(229 229 234);
    --c-grayl2: rgb(199 199 204);
    --c-grayl1: rgb(174 174 178);
    --c-gray: rgb(142 142 147);
    --c-grayd1: rgb(99 99 102);
    --c-grayd2: rgb(72 72 74);
    --c-grayd3: rgb(58 58 60);
    --c-lblue: rgb(0 122 255);
    --c-lblue-active: rgb(0 150 255);
    --c-dblue: rgb(10 132 255);
    --c-dblue-active: rgb(10 160 255);
    --c-black: rgb(0 0 0);
  }

  @media print {
      :root {
          --c-bg: white;
          --c-antitext: white;
          --c-lbg: white;
          --c-ltext: white;
      }
  }

  @media (prefers-color-scheme: dark) {
      :root {
          --c-bg: rgb(35 35 35);
          --c-antibg: rgb(250 250 250);
          --c-text: rgb(250 250 250);
          --c-antitext: rgb(28 28 30);
          --c-gray1: rgb(58 58 60);
          --c-gray2: rgb(72 72 74);
          --c-gray3: rgb(99 99 102);
          --c-gray4: rgb(142 142 147);
          --c-gray5: rgb(174 174 178);
          --c-gray6: rgb(199 199 204);;
          --c-gray7: rgb(229 229 234);
          --c-blue: rgb(10 132 255);
          --c-blue-active: rgb(10 160 255);
          --c-antiblue: rgb(0 122 255);
          --c-antiblue-active: rgb(0 150 255);
      }
  }

  @media print and (prefers-color-scheme: dark) { /* ??? */
      :root {
          --c-antibg: white;
          --c-text: white;
      }
  }
  ```

## Credit

+ **color** : [Apple human-interface](https://developer.apple.com/design/human-interface-guidelines/color) (* 모든 색상을 참고한것은 아님)
+ **font** : [**Pretendard**](https://github.com/orioncactus/pretendard) [BR Cobane](https://www.cdnfonts.com/br-cobane.font)
