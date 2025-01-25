### 쿼터파이

### Credit
+ **color** : [Apple human-interface](https://developer.apple.com/design/human-interface-guidelines/color)
+ **font** : [Apple SD Gothic Neo](https://support.apple.com/ko-kr/103203) [Gmarket Sans](https://corp.gmarket.com/fonts/) [Pretendard](https://github.com/orioncactus/pretendard)

### Interface
+ **hover animation**
  ![hover](https://github.com/qpi-labels/qpi-labels.github.io/blob/cf5ccdca1aae841e1974f232eabb6522db81e396/image%20source/hover.gif)
  ```
  .access-button {
            background-color: rgb(0, 122, 255);
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
  ```
