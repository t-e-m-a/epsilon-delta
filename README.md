# Epsilon - Delta

C++/raylib 프로그램을 HTML/CSS/JavaScript Canvas로 옮긴 웹 버전입니다. 별도 설치나 빌드 없이 작동합니다.

## 실행
압축을 풀고 index.html을 브라우저에서 엽니다. resources 폴더를 그대로 유지하세요. 지정한 CRoundBold_tema_Num.ttf 폰트가 포함되어 있습니다.

## GitHub Pages 게시
1. GitHub에서 새 Public 저장소를 만듭니다. 이름 예: epsilon-delta. Add README를 켜면 파일 업로드 메뉴를 찾기 쉽습니다.
2. 저장소에서 Add file → Upload files를 누릅니다.
3. ZIP을 풀고 그 안의 index.html, style.css, app.js, resources 폴더를 함께 드래그합니다. 바깥 epsilon-delta 폴더나 ZIP 자체를 올리지 마세요. README.md도 함께 올려도 됩니다.
4. Commit changes를 누릅니다. 저장소 최상위에 index.html이 보여야 하고, 폰트는 resources/CRoundBold_tema_Num.ttf 위치에 있어야 합니다.
5. Settings → Pages → Build and deployment에서 Source를 Deploy from a branch로 지정합니다.
6. Branch: main, Folder: /(root)를 선택하고 Save를 누릅니다.
7. 배포 완료 후 같은 Pages 화면의 Visit site로 접속합니다.

계정 t-e-m-a, 저장소 epsilon-delta의 예상 주소:
https://t-e-m-a.github.io/epsilon-delta/
아직 게시하지 않은 상태에서는 이 주소가 열리지 않습니다.

파일을 수정할 때는 같은 경로로 다시 업로드하고 Commit changes를 누릅니다. 배포 완료 후 Ctrl+F5로 새로고침하세요.

공식 안내:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 조작
- 1 / 2: 함수 선택. R: 초기화. 슬라이더에 키보드 초점이 있으면 단축키는 적용하지 않습니다.
- epsilon: 0.01~3. delta: 0.001~1.5. 작은 값 조절을 위해 로그 스케일을 사용합니다.
- 이차함수에서 Auto delta를 끄면 delta와 후보 L을 조절할 수 있습니다.
- 초록 점은 현재 조건 만족, 빨간 X는 위반입니다.
- 좌우 150개씩 총 300개를 검사합니다. a와 a±delta는 제외하며 오차가 epsilon과 같아도 위반입니다.
- MATH는 수학적 결론, SAMPLES는 현재 유한 샘플 결과입니다. 샘플 통과는 극한의 증명이나 일반적인 자동 판정이 아닙니다. 요청에 따라 해당 설명은 화면에 표시하지 않습니다.

## 수학적 근거
이차함수: 모든 epsilon>0에 delta=min(1,epsilon/5)를 택합니다. 0<|x-2|<delta이면 1<x<3, |x+2|<5이므로 |x²-4|=|x-2||x+2|<5|x-2|<5delta≤epsilon입니다.

점프 함수: 임의의 L에 epsilon=1을 택합니다. 모든 delta>0에 x=-delta/2와 +delta/2는 범위 안에 있습니다. 두 오차가 모두 1보다 작으면 삼각부등식에 의해 2≤|-1-L|+|1-L|<2라는 모순이 생깁니다. 따라서 항상 위반점이 있습니다. 좌극한=-1, 우극한=+1입니다.

## 검증 기록
- JavaScript 구문 검사 통과.
- 자동 검사 통과: 이차함수 delta 공식, 점프 함수 양쪽/한쪽 위반, epsilon 경계의 엄격한 부등식, 넓은 epsilon에서 샘플 통과와 수학적 결론의 분리, 300개 샘플의 열린 구간 포함 여부, 조절 및 초기화.
- 실제 브라우저 화면 검증은 미리보기 도구 및 로컬 접속 제한으로 수행하지 못했습니다.
- GitHub 업로드 및 배포는 수행하지 않았습니다.
