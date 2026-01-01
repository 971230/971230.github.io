// 平滑滚动

const lenis = new Lenis({
    // 解决覆盖其他滚动条bug
    // https://github.com/darkroomengineering/lenis/issues/334
    // https://github.com/darkroomengineering/lenis/issues/347
    prevent: (node) => node.classList.contains("md-sidebar__scrollwrap"),
});

lenis.on("scroll", (e) => {
    // console.log(e);
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// 解决 回到页面顶部 按钮失效bug，使用lenis重写点击事件
var topButton = document.querySelector('.md-top.md-icon[data-md-component="top"]');
if (topButton) {
    topButton.addEventListener('click', function() {
        // 平滑滚动到页面顶部
        lenis.scrollTo(0);
    });
}
