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
    color-scheme: light dark;

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

    --c-bg: light-dark(rgb(250 250 250),rgb(35 35 35));
    --c-antibg: light-dark(rgb(35 35 35),rgb(250 250 250));
    --c-text: light-dark(rgb(28 28 30),rgb(250 250 250));
    --c-antitext: light-dark(rgb(250 250 250),rgb(28 28 30));
    --c-gray1: light-dark(rgb(229 229 234),rgb(58 58 60));
    --c-gray2: light-dark(rgb(199 199 204),rgb(72 72 74));
    --c-gray3: light-dark(rgb(174 174 178),rgb(99 99 102));
    --c-gray4: light-dark(rgb(142 142 147),rgb(142 142 147));
    --c-gray5: light-dark(rgb(99 99 102),rgb(174 174 178));
    --c-gray6: light-dark(rgb(72 72 74),rgb(199 199 204));
    --c-gray7: light-dark(rgb(58 58 60),rgb(229 229 234));
    --c-blue: light-dark(rgb(0 122 255),rgb(10 132 255));
    --c-blue-active: light-dark(rgb(0 150 255),rgb(10 160 255));
    --c-antiblue: light-dark(rgb(10 132 255),rgb(0 122 255));
    --c-antiblue-active: light-dark(rgb(10 160 255),rgb(0 150 255));
  }

  @media print {
    :root {
      --c-lbg: white;
      --c-ltext: white;
      --c-bg: light-dark(white,rgb(35 35 35));
      --c-antibg: light-dark(rgb(35 35 35),white);
      --c-text: light-dark(rgb(28 28 30),white);
      --c-antitext: light-dark(white,rgb(28 28 30));
    }
  }
  ```

## Credit

+ **color** : [Apple human-interface](https://developer.apple.com/design/human-interface-guidelines/color) (* 모든 색상을 참고한것은 아님)
+ **font** : [**Pretendard**](https://github.com/orioncactus/pretendard) [BR Cobane](https://www.cdnfonts.com/br-cobane.font)
