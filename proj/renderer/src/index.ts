import "./index.css"
import $ from "jquery"

// 예제 코드입니다.
const btn = document.querySelector(".btn") as HTMLElement;
if (btn) {
    btn.onclick = onClick;
}

function onClick() {
    // jquery 잘 작동하는지 테스트.
    const tempBtn = $(".btn");

    const w = $(".btn").width();
    const h = $(".btn").height();
    console.log(`w: ${w}, h: ${h}`);
}