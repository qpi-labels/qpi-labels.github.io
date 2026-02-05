# CPT - **충**곽 **품**은 **타**이머

## CPT 소개

## CPT 사용법


***
***

# CPT 베이스 - QPI Ambient

## **GPU 과부하**

> 저사양 기기에서는 GPU 과부하 방지를 위해 [Performance Mode](# Performance Mode)를 사용하는 것을 권장합니다.

* QPI Ambient의 대기, 렌즈 플레어 시뮬레이션은 **높은 GPU 컴퓨팅 성능을 요구**합니다.
* 일부 저사양 기기에서는 GPU 과부하로 인한 화면 깜빡임 등의 문제가 보고되고 있습니다.
* 재까지 파악된 정보에 따르면, **Mali 아키텍처 기반 GPU가 타 아키텍처 대비 시뮬레이션 시 부하가 매우 높게 발생**하는 것으로 분석됩니다.
  
### GPU 과부하가 보고된 기기 및 SoC

| 기기 | SoC | GPU | 해상도 |
| :--- | :--- | :--- | :--- |
| Galaxy S21 | Exynos 2100 | Mali G78 | 2400x1080 |
| Galaxy S21 Ultra | Exynos 2100 | Mali G78 | 3200x1440 |
| Galaxy Tab S9 FE | Exynos 1380 | Mali G68 | 2304x1440 |

### GPU 과부하가 발생할 것으로 예상되는 SoC 

| 제조사 | SoC |
| :--- | :--- |
| Qualcomm | Snapdragon 855 및 이하 SoC |
| Qualcomm | Snapdragon 778G 및 이하 SoC |
| Samsung | Exynos 2100 및 이하 SoC |
| Samsung | Exynos 1380 및 이하 SoC |
| MediaTek | Dimensity 8350 및 이하 SoC |
| MediaTek | Dimensity 7300X 및 이하 SoC |

<br><br>
## Performance Mode

* GPU 과부하 방지를 위해 ```Performance Mode```를 사용할 수 있습니다.
* ```Performance Mode```는 ```updateSky()```함수를 조정하여 그래픽 저하 없이 GPU 부하를 줄입니다.
![퍼포먼스모드 동작](source/1000107899.gif)


<br><br>

## **웹 앱 설치 방법**

### IOS Safari

1. 앱 우하단의 미트볼 메뉴(...)를 클릭합니다.
2. ```공유``` 메뉴를 클릭합니다.
3. ```더 보기```를 클릭하거나 스크롤을 내린 뒤, ```홈 화면에 추가```를 클릭합니다.

### Android Chrome

1. 주소표시줄 우측에 위치한 ```모니터 아이콘```을 터치합니다.
2. ```설치``` 버튼을 터치합니다.

### Windows Chrome

1. 페이지에 접속한 채로 주소 표시줄 우측의 케밥 메뉴(⋮)를 클릭합니다.
2. ```전송, 저장, 공유``` 메뉴를 클릭합니다.
3. ```페이지를 앱으로 설치(...```를 클릭합니다.

### MacOS Safari

1. 페이지에 접속한 채로 우상단의 공유 버튼을 클릭합니다.
2. ```Dock에 추가```를 클릭합니다.
