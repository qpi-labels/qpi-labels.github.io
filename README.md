### 쿼터파이

### Design
+ **UI/UX**
  + 쿼터파이는 보다 직관적인 사용자 경험을 위해 불필요한 요소를 제거한 극도의 **미니멀리즘 UI**를 채택하였습니다.
    + 직관적인 사용자 경험을 위해 고정 디자인 요소는 **낮은 채도의 색**을, 상호작용 디자인 요소는 **높은 채도의 블루 계열 색**을 사용하였습니다.
    + 가독성을 위해 삐침이 강조되지 않은 **san serif체**를 사용하였습니다.
  + 불필요한 요소를 배제하는 한편, 직관적인 사용자 경험을 위한 **상호작용 애니메이션**을 일부 적용하였습니다.
    + 상호작용 요소를 강조하기 위해 **버튼 호버 애니메이션**을 적용하였습니다.
  + UI에 사용된 색상은 다음과 같습니다.
    + ${\textsf{\color{rgb(0, 0, 0)}BLACK (0, 0, 0)}}$
    + ${\textsf{\color{rgb(142, 142, 147)}GRAY (142, 142, 147)}}$
    + ${\textsf{\color{rgb(0, 122, 255)}BLUE (0, 122, 255)}}$
      
### Source Code
+ **web font import**
  ```
  <style>
     @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css");
  </style>
  ```
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

### Credit
+ **color** : [Apple human-interface](https://developer.apple.com/design/human-interface-guidelines/color)
+ **font** : [Apple SD Gothic Neo](https://support.apple.com/ko-kr/103203) [Gmarket Sans](https://corp.gmarket.com/fonts/) [**Pretendard**](https://github.com/orioncactus/pretendard)
