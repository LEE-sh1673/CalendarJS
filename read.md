<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<style>
html body {
    font-family: "Helvetica Neue", "Noto Sans", "NanumSquare", Helvetica,"Segoe UI",Arial;
}
</style>

# JavaScript 작동 방식 : 엔진, 런타임 및 호출 스택 개요

>**resource from:**
>1. [How JavaScript works: an overview of the engine, the runtime, and the call stack](https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf)
> 1. [V8 Memory usage(Stack & Heap)](https://speakerdeck.com/deepu105/v8-memory-usage-stack-and-heap)


JavaScript가 점점 더 대중화됨에 따라 개발자들은 프론트 엔드, 백 엔드, 하이브리드 앱, 임베디드 장치 등 스택의 여러 수준에서 지원을 활용하고 있습니다.

이 포스트는 자바 스크립트와 그것이 실제로 어떻게 작동하는지 더 깊이 파고 드는 것을 목표로 하는 시리즈의 첫 번째 글입니다. 우리는 자바 스크립트의 구성 요소와 그것들이 어떻게 함께 작동하는지 알면 더 나은 코드를 작성할 수 있고 더 나은 코드를 작성할 수 있을 것이라고 생각했습니다. 

또한 경쟁력을 유지하기 위해 견고하고 성능이 뛰어난 경량 JavaScript 애플리케이션인 [SessionStack](https://www.sessionstack.com/?utm_source=medium&utm_medium=source&utm_content=javascript-series-post1-intro)을 구축할 때 사용하는 몇 가지 경험에 근거한 방법들을 공유 할 것입니다.

[GitHut](https://githut.info/) 통계에서 볼 수 있듯이 JavaScript는 GitHub의 활성 저장소 및 총 푸시 측면에서 최상위에 있습니다. 다른 카테고리에서도 많이 뒤쳐지지 않습니다.

![](https://miro.medium.com/max/700/1*Zf4reZZJ9DCKsXf5CSXghg.png)

프로젝트가 JavaScript에 너무 많이 의존하는 경우, 이는 개발자가 언어와 생태계가 제공하는 모든 것을 활용하여 내부에 대한 더 깊고 깊은 이해를 통해 놀라운 소프트웨어를 구축해야 함을 의미합니다.

그 결과 매일 JavaScript를 사용하고 있지만 내부에서 일어나는 일에 대한 지식이 없는 개발자가 많이 있습니다.

## Overview

거의 모든 사람들이 이미 V8 엔진을 개념으로서 들어봤을 것이고, 대부분의 사람들은 JavaScript가 단일 스레드이거나 콜백 큐를 사용하고 있다는 것을 알고 있습니다.

이 포스트에서는 이러한 모든 개념을 자세히 살펴보고 JavaScript가 실제로 어떻게 실행되는지 설명할 것입니다. 이러한 세부 정보를 알게되면 제공된 API를 적절하게 활용하는 더 나은 비차단 앱(non-blocking apps)을 작성할 수 있을 것입니다.

만약 당신이 비교적 자바 스크립트를 처음 접하는 경우 블로그 게시물을 통해 자바 스크립트가 다른 언어에 비해 "**이상한**"이유를 이해할 수 있을 것입니다.

## The JavaScript Engine

자바 스크립트 엔진의 인기있는 예는 Google의 V8 엔진입니다. 예를 들어 V8 엔진은 Chrome 및 Node.js 내에서 사용됩니다. 아래는 이것이 어떻게 생겼는지에 대한 매우 간단한 그림입니다.

![](https://miro.medium.com/max/700/1*OnH_DlbNAPvB9KLxUCyMsA.png)


엔진은 두 가지 주요 구성 요소로 구성됩니다.

* 메모리 힙 — 메모리 할당이 발생하는 곳입니다.
* Call Stack — 코드가 실행될 때 스택 프레임이 있는 곳입니다.

## The Runtime

브라우저에는 거의 모든 JavaScript 개발자가 사용하는 API가 있습니다. (예 : "setTimeout"). 그러나 이러한 API는 엔진에서 제공하지 않습니다.

그렇다면 이것들은 어디서 온걸까요?

현실은 위의 그림보다 더 복잡하다는 것을 알 수 있습니다.

![](https://miro.medium.com/max/700/1*4lHHyfEhVB0LnQ3HlhSs8g.png)

그래서 우리는 엔진을 가지고 있지만 실제로 더 많은 것들이 있습니다. DOM, AJAX, setTimeout 등과 같은 브라우저에서 제공하는 웹 API라는 것들이 존재합니다.

그리고 우리는 매우 인기있는 **이벤트 루프**와 **콜백 큐**를 가지고 있습니다.

## The Call Stack

JavaScript는 단일 스레드 프로그래밍 언어이므로 단일 호출 스택이 있습니다. 따라서 한 번에 하나의 작업을 수행 할 수 있습니다.

Call Stack은 기본적으로 프로그램에서 우리가 어디에 있는지 기록하는 데이터 구조입니다. 함수에 들어가면 스택 맨 위에 놓습니다. 함수에서 돌아 오면 스택의 맨 위에서 튀어 나옵니다. 이것이 스택이 할 수있는 모든 것입니다.

예를 보겠습니다. 다음 코드를 보시면

```javascript
function multiply(x, y) {
    return x * y;
}
function printSquare(x) {
    var s = multiply(x, x);
    console.log(s);
}
printSquare(5);
```

엔진이 이 코드의 실행을 시작하면 호출 스택은 비어 있을 것입니다. 이후 단계는 다음과 같습니다.

![](https://miro.medium.com/max/700/1*Yp1KOt_UJ47HChmS9y7KXw.png)

