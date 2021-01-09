<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<style>
html body {
    font-family: "Helvetica Neue", "Noto Sans", "NanumSquare", Helvetica,"Segoe UI",Arial;
}
</style>

# JavaScript 작동 방식 : V8 엔진 내부 + 최적화 된 코드 작성 방법에 대한 5 가지 팁

resource from: 
- [How JavaScript works: inside the V8 engine + 5 tips on how to write optimized code](https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf)

## Overview

**자바스크립트 엔진**(JavaScript engine)은 자바스크립트 코드를 실행하는 프로그램 또는 인터프리터이다. 자바스크립트 엔진은 전통적인 인터프리터일 수도 있고, 특정한 방식으로 바이트코드로 JIT 컴파일을 할 수 있다. 여러 목적으로 자바스크립트 엔진을 사용하지만, 대체적으로 웹 브라우저에서 사용된다

아래는 유명한 JS engine들의 예시이다:

- **V8** — open source, developed by Google, written in C++
- **Rhino** — managed by the Mozilla Foundation, open source, developed entirely in Java
- **SpiderMonkey** — the first JavaScript engine, which back in the days powered Netscape Navigator, and today powers Firefox
- **JavaScriptCore** — open source, marketed as Nitro and developed by Apple for Safari
- **Chakra (JScript9)** — Internet Explorer
- **Chakra (JavaScript)** — Microsoft Edge

## Why was the V8 Engine created?

Google에서 만든 V8 Engine은 오픈 소스이며 C ++로 작성되었습니다. 이 엔진은 Google 크롬 내에서 사용됩니다. 

![](https://miro.medium.com/max/700/1*AKKvE3QmN_ZQmEzSj16oXg.png)

V8은 웹 브라우저 내에서 JavaScript 실행 성능을 높이기 위해 처음 설계되었습니다. 속도를 얻기 위해 V8은 인터프리터를 사용하는 대신 JavaScript코드를 보다 효율적인 기계어로 변환합니다.

 SpiderMonkey 또는 Rhino (Mozilla)와 같은 많은 최신 JavaScript 엔진처럼 **JIT** (Just-In-Time) 컴파일러를 구현하여 실행시 JavaScript 코드를 기계어로 컴파일합니다. 여기서 가장 큰 차이점은 V8은 바이트 코드나 중간 언어를 생성하지 않는다는 것입니다.

## V8 used to have two compilers

V8 버전 5.9가 나오기 전에 엔진은 두 개의 컴파일러를 사용했습니다.

- **codegen** — 단순하고 비교적 느린 기계어를 생성하는 간단하고 매우 빠른 컴파일러.
- **Crankshaft** — 고도로 최적화된 코드를 생성하는 보다 복잡한(Just-In-Time) 최적화 컴파일러.

또한 V8 엔진은 내부적으로 여러 스레드를 사용합니다.


- 메인 쓰레드는 여러분이 기대하는 것을 수행합니다: 코드를 가져 와서 컴파일 한 다음 실행합니다.
- 또한 컴파일을 위한 별도의 스레드가 있으므로 이 별도의 쓰레드가 코드를 최적화하는 동안 메인 스레드가 계속 실행될 수 있습니다.
- Crankshaft가 최적화 할 수 있도록 우리가 많은 시간을 소비하는 메서드에 대해 런타임에 알려주는 프로파일러 스레드가 있습니다.
- Garbage Collector 스윕(Sweep)을 처리하기 위한 몇 가지 스레드가 존재합니다.


> ### Garbage Collection in V8
> GC의 목적 자체는 단순하다. 사용되지 않는 메모리를 찾아 재사용할 수 있는 메모리로 전환하는 것이다. 즉, 참조 없는 객체들이 사용하는 메모리를 비워서 새로운 객체를 생성하기 위한 공간을 만드는 역할을 한다. 참조 없는 객체(orphan object)란, 스택으로부터 (다른 객체 내부의 참조를 통해) 더 이상 직접 혹은 간접적으로 참조되지 않는 객체를 말한다.
> 
> V8 엔진의 가비지 컬렉터의 역할은 V8 프로세스에서 재사용하기 위해 사용되지 않은 메모리를 회수하는 것이다. GC는 Heap 메모리를 대상으로 한다. Heap 메모리 전체에서 가비지 컬렉션이 실행되는 것은 아니다. Young과 Old 영역에서만 실행된다. 
>> **스위핑**(Sweeping): 가비지 컬렉터가 힙 메모리를 순회하면서 활성 상태로 표시되지 않은 객체들의 메모리 주소를 기록한다. 이 공간은 이제 사용 가능한 목록(free-list)에서 사용 가능하다고 표시되며 다른 객체들을 저장하는 데 사용될 수 있다.
> 참조: https://ui.toast.com/weekly-pick/ko_20200228


JavaScript 코드를 처음 실행할 때 V8은 파싱된 JavaScript를 변환없이 기계어로 직접 변환하는 **full - codegen**을 활용합니다. (즉, 처음 실행시 codegen 컴파일러를 이용.) 이를 통해 기계어 실행을 매우 빠르게 시작할 수 있습니다. V8은 인터프리터의 필요성을 제거하는 방식으로 중간 바이트 코드 표현을 사용하지 않습니다.

코드가 얼마 동안 실행되면 프로파일러 스레드는 최적화 해야 하는 메서드를 알 수 있는 충분한 데이터를 수집할 것 입니다.

다음으로 Crankshaft 최적화는 다른 스레드에서 시작됩니다. JavaScript 추상 구문 트리를 **Hydrogen**이라는 높은 수준의 정적 단일 할당 (SSA) 표현으로 변환하고 해당 Hydrogen 그래프를 최적화하려고합니다. 대부분의 최적화는이 수준에서 수행됩니다.

## Inlining

첫 번째 최적화는 가능한 한 많은 코드를 미리 **인라인**(inline)하는 것입니다. 인라인은 호출 사이트 (함수가 호출되는 코드 줄)를 호출 된 함수의 본문으로 바꾸는 프로세스입니다. 이 간단한 단계를 통해 다음 최적화가 더 의미를 가질 수 있습니다.

![](https://miro.medium.com/max/512/0*RRgTDdRfLGEhuR7U.png)



## Hidden class
JavaScript는 프로토 타입 기반 언어입니다. 클래스가 없으며 복제 프로세스를 사용하여 객체가 생성됩니다. JavaScript는 또한 동적 프로그래밍 언어이므로 인스턴스화 후 속성을 개체에서 쉽게 추가하거나 제거 할 수 있습니다.

대부분의 JavaScript 인터프리터는 Dictionary와 유사한 구조(해시 함수 기반)를 사용하여 메모리에 객체 속성 값의 위치를 ​​저장합니다. 이 구조는 JavaScript에서 속성 값을 검색하는 것이 Java 또는 C #과 같은 비동적 프로그래밍 언어에서보다 계산 비용이 더 많이 듭니다.

