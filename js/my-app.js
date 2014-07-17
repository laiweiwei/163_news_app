$(function(){
	
	//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	// Initialize your app
	var myApp = new Framework7({
		//pushState : true,
		swipePanel : "left",
		animatePages : false,
		swipeBackPage: false
	});

	// 覆盖打开tab的事件处理
	myApp.showTab = function (tab, tabLink) {
		tabLink.parent().find('.active').removeClass('active');
		tabLink.addClass('active');
		return true;
	};

	// Export selectors engine
	var $$ = Framework7.$;

	$$(document).on('ajaxStart', function () {
		myApp.showIndicator();
	});
	$$(document).on('ajaxComplete', function (xhr) {
		myApp.hideIndicator();
	});
	$$(document).on('ajaxError', function () {
		myApp.addNotification({
			title: '获取失败',
			message: '请检查你的网络然后重试'
		});
		myApp.hideIndicator();
	});

	// Add views
	var leftView = myApp.addView('.view-left', {
		dynamicNavbar: true
	});

	var leftView = myApp.addView('.view-right', {
		dynamicNavbar: true
	});

	var mainView = myApp.addView('.view-main', {
		dynamicNavbar: true
	});

	myApp.loadPage(mainView, "channel/home/index.html");

	//控制页面加载
	$$(document).on('pageBeforeAnimation', function(e){
	   var page = e.detail.page;
	   if (page.name == null || page.name == 'index' || page.name == 'categories' || page.name.indexOf('channel-') == 0) {
			$$(".sub-navbar").show();
			myApp.allowPanelOpen = true;
	   } else {
			$$(".sub-navbar").hide();
			myApp.allowPanelOpen = false
	   }
	});

	$$(document).on('pageAfterAnimation', function(e){
	   var page = e.detail.page;
	   if (page.name == 'index' || page.name == null || page.name.indexOf('channel-') == 0) {
			myApp.allowPanelOpen = true;
			if (page.name != null && page.name.indexOf('channel-') == 0) {
				loadChannel(page.name);
			}
	   } else {
			myApp.allowPanelOpen = false;
	   }
	});
	
	function loadChannel(channel) {

		//重置下默认左侧滑出菜单的设置
		myApp.params.swipePanel = "left";

		//准备一个跟频道相关的选择器名空间
		var prefix = '';
		if (channel && channel != ''){
			prefix = '.'+channel+' ';
		}

		//Init Navigation
		var nav = $(prefix+'.swiper-nav').swiper({
			slidesPerView: 'auto',
			watchActiveIndex: false,
			DOMAnimation: false,
			centeredSlides: false,
			onSlideClick: function(swiper){
				$(prefix+".swiper-slide-active").removeClass("swiper-slide-active");
				$(swiper.clickedSlide).addClass("swiper-slide-active");
				pages.swipeTo( swiper.clickedSlideIndex, 500, true );
			},
			onSwiperCreated: function(swiper) {
				swiper.params.followSwipeRightFinger = false;
				swiper.params.followSwipeLeftFinger = true;
			}
		})

		
		//Init Pages
		var pages = $(prefix+'.swiper-pages').swiper({
			freeMode: false,
			freeModeFluid: false,
			resistance: false,
			DOMAnimation: false,
			onSlideChangeStart: function(swiper){
				$(prefix+".swiper-slide-active").removeClass("swiper-slide-active");
				var slide = nav.getSlide(swiper.activeIndex);
				$(slide).addClass("swiper-slide-active");
				nav.swipeTo(swiper.activeIndex);
				
				if (swiper.previousIndex > swiper.activeIndex) {
					//若是第一个Slider，则开启左侧菜单滑出事件
					if (swiper.activeIndex == 0) {
						myApp.params.swipePanel = "left";
						swiper.params.followSwipeRightFinger = false;
						swiper.params.followSwipeLeftFinger = true;
						nav.params.followSwipeRightFinger = false;
						nav.params.followSwipeLeftFinger = true;
					} else {
						//否则禁止掉菜单滑动事件
						myApp.params.swipePanel = "";
						swiper.params.followSwipeRightFinger = true;
						swiper.params.followSwipeLeftFinger = true;
						nav.params.followSwipeRightFinger = true;
						nav.params.followSwipeLeftFinger = true;
					}
					myApp.initSwipePanels();
				} else {
					//若是最后一个Slider，则开启右侧菜单滑出事件
					var lastIndex = swiper.slides.length - 1;
					if (lastIndex == swiper.activeIndex) {
						myApp.params.swipePanel = "right";
						swiper.params.followSwipeLeftFinger = false;
						swiper.params.followSwipeRightFinger = true;
						nav.params.followSwipeLeftFinger = false;
						nav.params.followSwipeRightFinger = true;
					} else {
						//否则禁止掉菜单滑动事件
						myApp.params.swipePanel = "";
						swiper.params.followSwipeLeftFinger = true;
						swiper.params.followSwipeRightFinger = true;
						nav.params.followSwipeLeftFinger = true;
						nav.params.followSwipeRightFinger = true;
					}
					myApp.initSwipePanels();
				}
			},
			onSwiperCreated: function(swiper) {
				$(".page-content").css({visibility:'visible'});
				swiper.params.followSwipeRightFinger = false;
				swiper.params.followSwipeLeftFinger = true;
			}
		})

		//Scroll Containers
		$(prefix+'.scroll-container').each(function(){
			var sw = $(this).swiper({
				mode:'vertical',
				scrollContainer: true,
				mousewheelControl: true,
				scrollbar: {
					container:$(this).find('.swiper-scrollbar')[0]
				}
			});
			sw.params.followSwipeRightFinger = true;
			sw.params.followSwipeLeftFinger = true;
		});
		
		//Function to Fix Pages Height
		function fixPagesHeight() {
			var height = $(window).height()-nav.height;
			$('.swiper-pages').css({
				height: height
			});
		}
		$(window).on('resize',function(){
			fixPagesHeight()
		})
		fixPagesHeight();
	}
});