/**
 * Created by htzhanglong on 2015/8/2.
 */
// Ionic Starter App

var citsApp = angular.module('cits', ['ionic', 'ngFileUpload', 'pasvaz.bindonce', 'ngResource', 'ngIOS9UIWebViewPatch', 'mobiscroll-datetime','ngCookies']);
/*
 * */
citsApp.run(['$rootScope', '$location', '$state', 'HostFactory', '$ionicLoading', '$ionicPlatform', 'CommonFactory', 'Storage', 'ENV', '$ionicHistory', '$timeout', 'Session', 'LoginFactory', 'PopupFactory', '$ionicBackdrop', '$ionicViewSwitcher',  'MsgPushFactory','$ionicModal', function ($rootScope, $location, $state, HostFactory, $ionicLoading, $ionicPlatform, CommonFactory, Storage, ENV, $ionicHistory, $timeout, Session, LoginFactory, PopupFactory, $ionicBackdrop, $ionicViewSwitcher,  MsgPushFactory,$ionicModal) {
    $rootScope.cordova = true;
    $rootScope.deviceWidth = document.body.clientWidth;
    $rootScope.deviceHeight = (document.body.clientHeight == 0 ? document.querySelector('.backdrop').clientHeight : document.body.clientHeight);
    if (!window.cordova) {
        $rootScope.deviceWidth = $rootScope.deviceWidth > 640 ? 640 : $rootScope.deviceWidth;
        $rootScope.cordova = false;

    }

    CITS.initTraffic();
    CITS.info.unique = Storage.get(ENV.CITS_UUID_KEY) ? Storage.get(ENV.CITS_UUID_KEY) : CITS.duuid;
    Storage.set(ENV.CITS_UUID_KEY, CITS.info.unique);
    //Tab广告
    $rootScope.tabAdInfo = Storage.get(ENV.TAB_AD_KEY) ? Storage.get(ENV.TAB_AD_KEY) : new TabAd();

    $ionicPlatform.ready(function () {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        try {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

                //延迟splash screnn 隐藏时间,不然会有短暂的白屏出现
                /*setTimeout(function () {
                    navigator.splashscreen.hide();
                 }, 2000);*/
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        } catch (e) {

        }
        if (window.cordova) {
            $ionicModal.fromTemplateUrl("templates/common/serviceOnline.htm", {
                scope: $rootScope,
                animation: "slide-in-up"
            }).then(function (modal) {
                $rootScope.serviceOnlineModal = modal;
            });
        }

        // Android处理返回键
        var backButtonHandler = function (e) {
            e.preventDefault();

            function showConfirm() {
                var confirmPopup = PopupFactory.commonConfirmPopup('退出应用', '你确定要退出国旅在线吗？');
                confirmPopup.then(function (res) {
                    if (res) {
                        //ionic.Platform.exitApp();
                        $rootScope.quitApp();
                    } else {
                        // Don't close
                    }
                });
            }

            if ($location.path() == '/home') {
                showConfirm();
            } else if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('home');
            }

            return false;
        };
        $ionicPlatform.registerBackButtonAction(backButtonHandler, 100);

        CommonFactory.getCardType();
        // 首次加载或F5刷新加载，校验用户信息,如果不存在清除本地缓存,如果存在更新缓存信息
        if (CommonFactory.getUserInfo() != null) {
            $rootScope.$on('user.init', function () {
                $rootScope.userExistFlag = CommonFactory.userCheckResult();

                if (!$rootScope.userExistFlag) {
                    CommonFactory.clearUser();
                } else {
                    LoginFactory.getCacheMemberInfo('userCache.init', {userName: CommonFactory.getUserInfo().loginId});
                }
            });
            CommonFactory.checkUserExist('user.init');
        }
		
		//app首次加载时获取设备Id以及应用下载各个渠道标识字符串
		if (window.cordova) {

			var fail = function (e) {

			};

			CustomBaseMainPlugin.collectDeivceType(function (r) {
				var str = angular.fromJson(r);
				CITS.deivceType.channel = str.channel; //设备渠道
				CITS.deivceType.deviceUDID = str.DeviceUDID; //设备ID
			}, fail, [{}]);
		}
    });


    $rootScope.setJumpUrl = function (state, param) {
        Session.set('stateForRefresh', state);
        Session.set('paramForRefresh', param);
    },
        $rootScope.getJumpUrl = function () {
            var state = Session.get("stateForRefresh");
            var param = Session.get("paramForRefresh");
            $timeout(function () {
                $ionicHistory.clearHistory();
            }, 1000);
            if ((state || '').length > 0) {
                $state.go(state, param);
            } else {
                $state.go('home');
            }
        };
    if (window.cordova) {
        $rootScope.$on('mobileIndexTabAd.init', function () {
            var mobileIndexTabAd = CommonFactory.getAdList('mobileIndexTabAd');
            if((mobileIndexTabAd||"").length>0){
                var mobilead=mobileIndexTabAd[0];
                var tabAd= new TabAd();
                tabAd.ad_link=mobilead.ad_link;
                tabAd.ad_pic = ENV.imgUrl + mobilead.ad_pic;
                Storage.set(ENV.TAB_AD_KEY, tabAd);
            }else{
                var tabAd= new TabAd();
                Storage.set(ENV.TAB_AD_KEY, tabAd);
            }
        });
        CommonFactory.loadAdList('mobileIndexTabAd.init', {
            channel: 'mobile',
            position: 'mobileIndexTabAd'
        }, 'mobileIndexTabAd');
    }
    $rootScope.$on('loading:show', function () {
        $ionicBackdrop.retain();
        $rootScope.showLoading = true;
    });

    $rootScope.$on('loading:hide', function () {
        $rootScope.showLoading = false;
        $ionicBackdrop.release();

    });
    $rootScope.tabhome = function () {
        $ionicViewSwitcher.nextTransition('none');

        $state.go('home');
        return false;
    };
    $rootScope.tabmember = function () {
        $ionicViewSwitcher.nextTransition('none');
        $state.go("member_index");
        return false;
    };
    // 清除模型
    $rootScope.$on('payDestroy', function () {
        $rootScope.payModal.remove();
    });

    //cordova
        loadURL.home = function () {
        	$ionicViewSwitcher.nextTransition('none');
            $state.go("home");
        };
        loadURL.member = function () {
        	$ionicViewSwitcher.nextTransition('none');
            $state.go("member_index");
        };

        loadURL.search = function () {
            $ionicViewSwitcher.nextTransition('none');
            $state.go("all_searchDest");
        };
        loadURL.showImage = function () {
            CITS.saveTraffic(false);
        };

        loadURL.hideImage = function () {
            CITS.saveTraffic(true);
        };
    loadURL.kefuBack = function () {
        $state.go("home");
    };
        loadURL.go = function (obj) {

            if (obj) {
                obj = eval("(" + obj + ")");
                if (obj.state) {
                    if (obj.params) {
                        $state.go(obj.state, obj.params);
                    } else {
                        if (obj.state == 'all_searchDest') {
                            $ionicViewSwitcher.nextTransition('none');
                            $state.go('all_searchDest', {'channel': '0'});
                        } else {

                            $state.go(obj.state);
                        }
                    }

                }

        }
        //$location.path(obj); 要用TIMEOUT
    };

    // 查询我的消息数量
    loadURL.resetMessageNum = function () {
        $rootScope.$on('queryMsgNum.init', function () {
            $rootScope.msgMap = MsgPushFactory.getMsgInfoReturn();
            $rootScope.allInfor = $rootScope.msgMap.allInfor;
        });

        MsgPushFactory.getMsgInfo('queryMsgNum.init', {login_id: CommonFactory.getUserInfo().loginId});
    };

    $rootScope.addTravelNotesFlg = true;
    $rootScope.addTravelNotes = function () {
        var win = function (r) {
            $ionicViewSwitcher.nextTransition('none');
            if (!$ionicHistory.backView()) {
                $state.go('home');
            }
            ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
        };
        var fail = function (e) {
            $ionicViewSwitcher.nextTransition('none');
            if (!$ionicHistory.backView()) {
                $state.go('home');
            }
            ($ionicHistory.backView() && $ionicHistory.backView().url.indexOf('login') > 0) ? $ionicHistory.goBack(-2) : $ionicHistory.goBack();
        };
        if ($rootScope.addTravelNotesFlg) {
            $rootScope.addTravelNotesFlg = false;
        CustomBaseMainPlugin.pageJumpsNaviTableView(win, fail, [{skipPathType: 'addTravelNotes'}]);
        // @"addTravelNotes"   //添加游记
        }
        $timeout(function () {
            $rootScope.addTravelNotesFlg = true;
        }, 1000);
    };
        $rootScope.appChannel = function (type) {
            var win = function (r) {
            };
            var fail = function (e) {
            };
        if (window.cordova) {
            CustomBaseMainPlugin.pageJumpsNaviTableView(win, fail, [{skipPathType: type}]);
            //@"userMessagePath" //我的消息标签   @"userMorePath"   //更多标签 @"travelNotesList"   //暂存游记列表
        } else {
            PopupFactory.tipPopup("请下载国旅行在线APP进行爱旅行相关功能操作。");
        }
    };
    $rootScope.travelNotesListFlg = true;
    $rootScope.travelNotesList = function (type) {
        var win = function (r) {
            if (type == 'travelAround') {
                $state.reload();
            } else {
                $state.reload();
            }
        };
        var fail = function (e) {

        };
        if (window.cordova) {
            if ($rootScope.travelNotesListFlg) {
                $rootScope.travelNotesListFlg = false;
            CustomBaseMainPlugin.pageJumpsNaviTableView(win, fail, [{
                skipPathType: 'travelNotesList',
                travelNotesListType: type
            }]);
            }
            $timeout(function () {
                $rootScope.travelNotesListFlg = true;
            }, 1000);
            //@"travelNotes" //游记   @"travelAround"   //旅行圈
        } else {
            PopupFactory.tipPopup("请下载国旅行在线APP进行爱旅行相关功能操作。");
        }
    };
    $rootScope.travelNotesEditFlg = true;
    //修改游记
    $rootScope.appEditTrip = function (essayId, essayType) {
        var win = function (r) {
            if (essayType == 'YJ') {
                // 刷新页面
                $state.reload();
            } else {
                $state.reload();
            }
        };
        var fail = function (e) {
        };
        if ($rootScope.travelNotesEditFlg) {
            $rootScope.travelNotesEditFlg = false;
        CustomBaseMainPlugin.pageJumpsNaviTableView(win, fail, [{
            skipPathType: 'travelNotesEdit',
            essayId: essayId,
            essayType: essayType
        }]);
        }
        $timeout(function () {
            $rootScope.travelNotesEditFlg = true;
        }, 1000);
    };
        $rootScope.quitApp = function (type) {
            var win = function (r) {
            };
            var fail = function (e) {
            };
            CustomBaseMainPlugin.quitApp(win, fail, []);
        };
        $rootScope.appShake = function () {
            var win = function (r) {
            };
            var fail = function (e) {
            };
        CustomBaseMainPlugin.pageJumpsNaviTableView(win, fail, [{skipPathType: 'shakePath'}]);
        };
        $rootScope.payByWX = function (wxJson) {
            var win = function (r) {
                PopupFactory.tipPopup(r);
                $timeout(function () {
                    // 跳转成功页面
                    $state.go('pay_success');
                }, 2000);
            };
            var fail = function (e) {
                PopupFactory.tipPopup(e);
                $timeout(function () {
                    if (e != null && e.indexOf('取消') > 0) {
                        // 跳转失败页面
                        $state.go('member_index');
                    } else {
                        // 跳转失败页面
                        $state.go('pay_error');
                    }
                }, 2000);
            };
            CustomMainDefrayPlugin.weiXinPayRequest(win, fail, wxJson);
        };

    $rootScope.payByAlipay = function (priceInfo) {
        var win = function (r) {
            $rootScope.$broadcast('loading:show');
            CommonFactory.aliPayRerifyReq('aliPayRerifyReq.init', {
                verifyStr: r
            });
        };
        var fail = function (e) {
            $state.go('pay_error');
        };
        CustomMainDefrayPlugin.aliPayRequest(win, fail, priceInfo);
    };


        $rootScope.appLogin = function () {
            var win = function (r) {
                if (r.resultStatus == 'succeed') {  //来判断是否正确
                    CITS.saveTraffic(r.showImage);
                }
            };
            var fail = function (e) {
            };

            CustomBaseMainPlugin.commuteUserInfo(win, fail, [{uesrRegisterName: CommonFactory.getUserInfo()}]);
        };
        $rootScope.appLogout = function () {
            var win = function (r) {

            };
            var fail = function (e) {
            };

            CustomBaseMainPlugin.commuteUserInfo(win, fail, [{}]);
        };
    //add by sunsh 20160523 发现页面调用原生方法
    $rootScope.pushDiscoverPages = function (pageFlag) {
        var win = function (r) {

        };
        var fail = function (e) {
        };
        CustomBaseMainPlugin.pushDiscoverPages(win, fail, [pageFlag]);
    };

    $rootScope.deviceWidth = document.body.clientWidth;
    $rootScope.deviceHeight = (document.body.clientHeight == 0 ? document.querySelector('.backdrop').clientHeight : document.body.clientHeight);
    if (!window.cordova) {
        $rootScope.deviceWidth = $rootScope.deviceWidth > 640 ? 640 : $rootScope.deviceWidth;
    }

//监听路由事件
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            if (fromState != null && fromState != undefined && fromState.name == 'home') {
                $rootScope.$broadcast('home:hide');
            }
            $rootScope.$broadcast('loading:hide');
            var biteReg = new RegExp("(^|&?)biteflag=([^&]*)(&|$)", "i");
            var reg = new RegExp("(^|&?)user=([^&]*)(&|$)", "i");
            var absUrl = $location.absUrl();
            var bite = absUrl.match(biteReg);
            if (bite != null) {
                var biteFlag = unescape(bite[2]);
                Session.set(ENV.BITE_FLAG_KEY, biteFlag);
            }

            var r = absUrl.match(reg);
            if (r != null) {
                var perUser = unescape(r[2]);
            }
            else {
                var perUser = null;
            }
						
			/*var loginReg = new RegExp("(^|&?)loginflag=([^&]*)(&|$)", "i");
            var lreg = new RegExp("(^|&?)user=([^&]*)(&|$)", "i");
            var labsUrl = $location.absUrl();
            var lbite = labsUrl.match(loginReg);
            if (lbite != null) {
                var lFlag = unescape(lbite[2]);
                Session.set(ENV.LOGIN_FLAG_KEY, lFlag);
            }

            var lr = absUrl.match(lreg);
            if (lr != null) {
                var perUser = unescape(r[2]);
            }
            else {
                var perUser = null;
            }*/
            var params = $location.search();
            if (params.domain != null && params.domain != undefined && params.domain != HostFactory.getHostDomain()) {
                event.preventDefault();
                $ionicHistory.clearCache().then(function () {
                    HostFactory.setHostDomain(params.domain);
                    if (toState.name == 'home_user') {
                        $state.go('home');//设置路由地址
                    } else {
                        $state.go(toState.name, toParams);
                    }
                });
            }
            if (perUser != null && perUser != undefined && perUser != '' && perUser != HostFactory.getPersonShopUser()) {
                event.preventDefault();
                //特殊权限处理
                HostFactory.setHostDomain('www.cits.cn');
                $ionicHistory.clearCache().then(function () {
                HostFactory.setPersonShopUser(perUser);

                    var promise = CommonFactory.qloadPersonShopInfo(); // 同步调用，获得承诺接口
                    promise.then(function (data) {  // 调用承诺API获取数据 .resolve
                        if (toState.name == 'home') {
                            $state.go('home_user');//设置路由地址
                        } else {
                            $state.go(toState.name, toParams);
                        }
                    }, function (data) {  // 处理错误 .reject
                    });
                });
            }
            if (toState.name == 'home_user' && HostFactory.getPersonShopUser() == null) {
                $location.path('/home');//设置路由地址
            }
            //如果目标页面需要用户登录，而当前尚未登录，则自动重定向到登录界面
            //判断toParams是否为空
            var isEmpty = true;
            for (var n in toParams) {
                isEmpty = false
            }
            //为空则将toParams由{}改为‘’,否则获取到的是[object object]，在手机上无法跳转
            toParams = isEmpty ? '' : toParams;
            var state = $state.get(toState.name);
            if (!window.cordova && (CITS.getChannelSource() == '11')) {
				Session.set('zdstate', 2);
                /*var statezd = Session.get('zdstate');
                if (statezd == 1 || statezd == 2) {
                } else {
                    //$rootScope.zidongdl();
                }*/
            }
            if (state.requiredLogin && !CommonFactory.isLogined()
            ) {
                event.preventDefault();
                /* 跳转到登录前，清空个人信息 */
                CommonFactory.clearUser();
                /*JSON参数以字符串格式传递--------------------------*/
                $state.go('member_login', {
                    'last': toState.name,
                    'params': toParams
                });
            }
            //网络推广来源
            var sourceflagReg = new RegExp("(^|&?)sourceflag=([^&]*)(&|$)", "i");
            var sourceflagLs = absUrl.match(sourceflagReg);
            if ((sourceflagLs || '') != '') {
                var sourceflag = sourceflagLs[2];
                if ((sourceflag || '') != '' && sourceflag != HostFactory.getSourceFlag()) {
                    $ionicHistory.clearCache().then(function () {
                        HostFactory.setSourceFlag(sourceflag);
                    });
                }
            }
        });
    // 微信分享手机网站的微信或者微店
    $rootScope.weiXinShare = function (title, imgUrl, description, stateName) {
        if (!window.cordova && (CITS.getChannelSource() == '11' || CITS.getChannelSource() == '13')) {
            CommonFactory.loadWeiXinService('', title, imgUrl, description, stateName);
        }
    };
    // 手机网站的微信或者微店
    if (!window.cordova && (CITS.getChannelSource() == '11' || CITS.getChannelSource() == '13')) {
        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                CommonFactory.loadWeiXinService('', '', '', '', toState.name);
            });
    }
    // app分享
    $rootScope.appShare = function (title, imgUrl, description, index) {
        if (window.cordova) {
            var thisLink = ENV.SHARE_FILE_URL + $location.path();
            if (thisLink.indexOf("/route/search/") > 0 || thisLink.indexOf("/home") > 0) {
                // 大搜页面和首页需要添加域名
                thisLink += '?domain=' + HostFactory.getHostDomain();
            }

            var perShopInfo = Session.get(ENV.PERSON_PHONE_KEY);
            if (perShopInfo != null) {
                // 微店需要添加店主
                if (thisLink.indexOf('?domain=') > 0) {
                    thisLink += '&user=' + perShopInfo.account;
                } else {
                    thisLink += '?user=' + perShopInfo.account;
                }
            }

            var thisImgUrl = imgUrl;
            if (!thisImgUrl) {
                if (perShopInfo) {
                    thisImgUrl = ENV.imgUrl + perShopInfo.icon;
                } else {
                    thisImgUrl = ENV.imgUrl + 'images/b2c/logo_1.png';
                }
            } else if (thisImgUrl.indexOf("http://file") < 0) {
                thisImgUrl = ENV.imgUrl + thisImgUrl;
            }

            var shareType = [];
            shareType[0] = 'SSDKPlatformSubTypeWechatSession';  // 微信好友
            shareType[1] = 'SSDKPlatformSubTypeWechatTimeline';  // 微信朋友圈
            shareType[2] = 'SSDKPlatformTypeSinaWeibo';   // 新浪微博
            shareType[3] = 'SSDKPlatformSubTypeQQFriend';   // QQ好友
            shareType[4] = 'SSDKPlatformSubTypeQZone';    // QQ空间
            CustomBaseMainPlugin.shareContentPassPlugin(function (str) {
                // 广播
                $rootScope.$broadcast('closeShare.init');
                PopupFactory.tipPopup(str);
            }, function (str) {
                $rootScope.$broadcast('closeShare.init');
                if (str)PopupFactory.tipPopup(str);
            }, [description, thisImgUrl, thisLink, title, shareType[index]]);
        }
    };
}]);


citsApp.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider', '$sceDelegateProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $sceDelegateProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    if (!window.cordova) {
        $ionicConfigProvider.views.transition('none');
    }

    /*A前进页面不缓存，全部重新加载----------------------------------------------*/
    $ionicConfigProvider.views.forwardCache(false);

    // ios禁用侧滑返回
    $ionicConfigProvider.views.swipeBackEnabled(false);

    /* 为了解决键盘弹出屏幕折叠问题，android:windowSoftInputMode=adjustPan 依赖  */
    ionic.Platform.isFullScreen = false;

    $stateProvider
        .state('home', {
            url: '/home',
            //cache: false,
            templateUrl: 'templates/home/home.htm',
            controller: 'HomeCtrl'

        })
        .state('home_user', {
            url: '/person',
            templateUrl: 'templates/home/homeUser.htm',
            controller: 'HomeUserCtrl'
        })
        //系统出错页面
        .state('error', {
            url: '/error',
            templateUrl: 'templates/common/error.htm',
            controller: 'ErrorCtrl'
        })
        //系统出错页面
        .state('werror', {
            url: '/werror',
            templateUrl: 'templates/common/werror.htm',
            controller: 'ErrorCtrl'
        })
        //系统出错页面
        .state('auth', {
            url: '/auth',
            templateUrl: 'templates/common/auth.htm',
            controller: 'ErrorCtrl'
        })
        .state('net', {
            url: '/net',
            templateUrl: 'templates/common/net.htm',
            controller: 'ErrorCtrl'
        })
        .state('404', {
            url: '/404',
            templateUrl: 'templates/common/404.htm',
            controller: 'ErrorCtrl'
        })
        //全文检索页面
        .state('all_searchDest', {
            url: '/search/:channel',
            //cache: false,
            templateUrl: "templates/home/homeSearch.htm",
            controller: 'HomeSearchCtrl'
        })
        //站点选择页面
        .state('domain_select', {
            url: '/domain',
            cache: false,
            templateUrl: "templates/home/domainSelect.htm",
            controller: 'DomainSelectCtrl'
        })
        //聚合页面
        .state('route_search', {
            url: '/route/search/:desturl',
            // cache: false,
            templateUrl: "templates/search/routeSearch.htm",
            controller: 'SearchCtrl'
        })

        //聚合页面
        .state('ticket_search', {
            url: '/ticket/search/:desturl',
            //cache: false,
            templateUrl: "templates/search/ticketSearch.htm",
            controller: 'TicketCtrl'
        })
        //聚合页面
        .state('visa_search', {
            url: '/visa/search/:desturl',
            // cache: false,
            templateUrl: "templates/search/visaSearch.htm",
            controller: 'VisaCtrl'
        })
        //订单预订失败页面
        .state('bookError', {
            url: 'shop/book/bookError',
            templateUrl: "templates/common/bookError.htm",
            params: {resultData: '@resultData'},
            controller: 'BookResultCtrl'
        })
        //订单预订成功页面
        .state('bookSucc', {
            url: 'shop/book/bookSucc',
            cache: false,
            templateUrl: "templates/common/bookSucc.htm",
            params: {resultData: '@resultData'},
            controller: 'BookResultCtrl'
        })
    /*******************两游用start********************/
        //两游详细页(基础数据)
        .state('team_detail', {
            url: '/team/detail/:routeId',
            //cache: false,
            templateUrl: 'templates/team/routeDetail.htm',
            params: {'routeId': '@routeId', 'favoriteFlg': ''},
            controller: 'RouteDetailCtrl'
        })

        //温馨提示页
        .state('team_quote', {
            url: '/team/quote/:routeId',
            templateUrl: 'templates/team/quoteInfo.htm',
            controller: 'LargeTextCtrl'
        })

        //另付费项目说明页面
        .state('team_otherPaid', {
            url: '/team/otherpaid/:routeId',
            templateUrl: 'templates/team/otherPaid.htm',
            controller: 'LargeTextCtrl'
        })

        //购物说明页面
        .state('team_shopping', {
            url: '/team/shopping/:routeId',
            templateUrl: 'templates/team/shopping.htm',
            controller: 'LargeTextCtrl'
        })

        //签证信息页
        .state('team_visa', {
            url: '/team/visa/:routeId',
            templateUrl: 'templates/team/visa.htm',
            controller: 'LargeTextCtrl'
        })

        //温馨提示页
        .state('team_memo', {
            url: '/team/memo/:routeId',
            templateUrl: 'templates/team/memo.htm',
            controller: 'LargeTextCtrl'
        })

        //预订须知页
        .state('team_note', {
            url: '/team/note/:routeId',
            templateUrl: 'templates/team/note.htm',
            controller: 'LargeTextCtrl'
        })

        //另付费项目详细页面
        .state('team_otherPaidDetail', {
            url: '/team/otherpaid/detail/:opId',
            templateUrl: 'templates/team/otherPaidDetail.htm',
            controller: 'LargeTextDetailCtrl'
        })

        //购物说明详细页面
        .state('team_otherShoppingDetail', {
            url: '/team/shopping/detail/:opId',
            templateUrl: 'templates/team/shoppingDetail.htm',
            controller: 'LargeTextDetailCtrl'
        })

        //签约付款页面
        .state('team_signingPayment', {
            url: '/team/payment/:routeId',
            templateUrl: 'templates/team/signingPayment.htm',
            controller: 'LargeTextCtrl'
        })

        //团详细页面
        .state('team_date', {
            url: '/team/date/:routeId',
            templateUrl: 'templates/team/teamDetail.htm',
            params: {'routeId': '@routeId'},
            cache: false,
            controller: 'TeamDetailCtrl'
        })

        //两游预订页面
        .state('team_book', {
            url: '/team/book/booking',
            templateUrl: 'templates/team/teamBooking.htm',
            params: {
                'loginJumpUrl': 'team_book',
                bookingData: '@bookingData',
                'orderInfo': '@orderInfo',
                'returnBackFlag': '@returnBackFlag'
            },
            controller: 'TeamBookCtrl',
            cache: false,
            requiredLogin: true
        })

    /*******************两游用end********************/

    /*******************邮轮start********************/
        //邮轮详细页(基础数据)
        .state('cruise_detail', {
            url: '/cruise/detail/:searchType/:routeId',
            templateUrl: 'templates/cruise/cruiseDetail.htm',
            params: {'searchType': '', 'routeId': '', 'favoriteFlg': ''},
            //cache: false,
            controller: 'CruiseDetailCtrl'
        })

        //邮轮船只详细信息
        .state('cruise_ship', {
            url: '/cruise/ship/:shipId',
            templateUrl: 'templates/cruise/cruiseShip.htm',
            //cache: false,
            controller: 'CruiseShipCtrl'
        })

        //邮轮公司详细信息
        .state('cruise_company', {
            url: '/cruise/company/:companyId',
            templateUrl: 'templates/cruise/cruiseCompany.htm',
            // cache: false,
            controller: 'CruiseCompanyCtrl'
        })

        //舱位详细信息页面
        .state('cruise_team', {
            url: '/cruise/team/:searchType/:routeId/:teamId/:cabinId',
            templateUrl: 'templates/cruise/cruiseTeam.htm',
            cache: false,
            params: {},
            controller: 'CruiseTeamCtrl'
        })

        //邮轮预订页面
        .state('cruise_book', {
            url: '/cruise/book/booking',
            templateUrl: 'templates/cruise/cruiseBooking.htm',
            cache: false,
            params: {bookingData: '@bookingData'},
            controller: 'CruiseBookCtrl',
            requiredLogin: true
        })

        //费用说明页面
        .state('cruise_quote', {
            url: '/cruise/quote/:routeId',
            templateUrl: 'templates/cruise/quoteInfo.htm',
            controller: 'CruiseTextCtrl'
        })

        //签证信息页
        .state('cruise_visa', {
            url: '/cruise/visa/:routeId',
            templateUrl: 'templates/cruise/visa.htm',
            controller: 'CruiseTextCtrl'
        })

        //温馨提示页
        .state('cruise_memo', {
            url: '/cruise/memo/:routeId',
            templateUrl: 'templates/cruise/memo.htm',
            controller: 'CruiseTextCtrl'
        })

        //预订须知页
        .state('cruise_note', {
            url: '/cruise/note/:routeId',
            templateUrl: 'templates/cruise/note.htm',
            controller: 'CruiseTextCtrl'
        })

        //签约付款页面
        .state('cruise_signingPayment', {
            url: '/cruise/payment/:routeId',
            templateUrl: 'templates/cruise/signingPayment.htm',
            controller: 'CruiseTextCtrl'
        })

    /*******************邮轮end********************/

    /*******************旅游类共同用start********************/
        //预订市场活动页面
        .state('coupon_market', {
            url: '/:channelFlg/book/market',
            templateUrl: 'templates/common/couponMarket.htm',
            cache: false,
            params: {param: '@param', channelFlg: '@channelFlg'},
            controller: 'CouponMarketCtrl'
        })
        //预订成功页面
        .state('travel_success', {
            url: '/:channelFlg/book/success',
            templateUrl: 'templates/common/travelSuccess.htm',
            cache: false,
            params: {orderParam: '@orderParam', channelFlg: '@channelFlg'},
            controller: 'CommonBookCtrl'
        })
        //预订支付成功页面
        .state('travel_pay_success', {
            url: '/book/pay/success',
            templateUrl: 'templates/common/travelPaySuccess.htm',
            cache: false,
            params: {orderParam: '@orderParam'},
            controller: 'CommonBookPayCtrl'
        })
        //预订成功失败页面
        .state('travel_fail', {
            url: '/:channelFlg/book/fail',
            templateUrl: 'templates/common/travelFail.htm',
            cache: false,
            params: {orderParam: '@orderParam', channelFlg: '@channelFlg'},
            controller: 'CommonBookCtrl'
        })
    /*******************旅游类共同用end********************/


        .state('visa_home', {
            url: '/visa/home',
            templateUrl: "templates/visa/visaHome.htm",
            controller: 'VisaHomeCtrl'
        })

        .state('visa_notice', {
            url: '/visa/notice',
            templateUrl: "templates/visa/visaNotice.htm",
        })

        .state('visa_process', {
            url: '/visa/process',
            templateUrl: "templates/visa/visaProcess.htm",
        })

        .state('visa_knowledge', {
            url: '/visa/knowledge',
            templateUrl: "templates/visa/visaKnowledge.htm",
        })

        .state('visa_detail', {
            url: '/visa/detail/:vid',
            cache: 'false',
            templateUrl: "templates/visa/visaDetail.htm",
            controller: 'VisaProdDetailCtrl'
        })

        .state('visa_material', {
            url: '/visa/material/:vid',
            cache: 'false',
            templateUrl: "templates/visa/visaMaterial.htm",
        })

        .state('visa_booking', {
            url: '/visa/booking',
            cache: 'false',
            params: {'loginJumpUrl': "visa_booking", 'bookingData': null, 'orderInfo': null},
            templateUrl: "templates/visa/visaBooking.htm",
            controller: 'VisaBookingCtrl',
            requiredLogin: true
        })

        .state('booking_success', {
            url: '/visa/booking/success',
            params: {'data': {}},
            cache: 'false',
            templateUrl: "templates/visa/bookingSuccess.htm",
            controller: 'BookingSuccCtrl'
        })
        .state('booking_failure', {
            url: '/visa/booking/fail',
            params: {'visaId': null},
            cache: 'false',
            templateUrl: "templates/visa/bookingFailure.htm",
            controller: 'BookingFailCtrl'
        })
    /******************* 会员中心 开始 ********************/
        .state('discovery', {
            url: '/member/discovery',
            //cache: false,
            templateUrl: "templates/member/discovery.htm",
            controller: 'DiscoveryCtrl'
        })
        .state('member_index', {
            url: '/member/index',
            cache: false,
            templateUrl: "templates/member/index.htm",
            controller: 'MemberCtrl',
            requiredLogin: true
        })
        .state('integral_rule', {
            url: '/member/integralRule',
            cache: false,
            templateUrl: "templates/member/integralRule.htm",
            controller: 'MemberCtrl'
        })
        .state('member_privilege', {
            url: '/member/memberPrivilege',
            cache: false,
            templateUrl: "templates/member/memberPrivilege.htm"
        })
        .state('member_order', {
            url: '/member/order',
            params: {'data': null},// 如果页面有跳转，可以自定义参数
            cache: false,
            templateUrl: "templates/member/order/orderList.htm",
            controller: 'MemberOrderCtrl',
            requiredLogin: true
        })

        .state('order_detail', {
            url: '/order/detail/:orderId/:channel',
            cache: false,
            templateUrl: "templates/member/order/detail/orderDetail.htm",
            controller: 'MemberOrderDetailCtrl',
            requiredLogin: true
        })

        .state('order_contract', {
            url: '/contract/:orderId/:contractFlg',
            cache: false,
            templateUrl: "templates/member/order/contract/contractInfo.htm",
            controller: 'MemberContractCtrl',
            requiredLogin: true
        })

        .state('contract_sign', {
            url: '/sign/:loginId/:vid',
            cache: false,
            params: {loginId: null, vid: null},
            templateUrl: "templates/member/order/contract/contractSign.htm",
            controller: 'ContractSignCtrl',
            requiredLogin: true
        })

        .state('contract_see', {
            url: '/see/:contractId',
            cache: false,
            params: {contractId: null},
            templateUrl: "templates/member/order/contract/contractSee.htm",
            controller: 'ContractSeeCtrl',
            requiredLogin: true
        })

        .state('contract_succ', {
            url: '/contract/succ',
            params: {param: null},
            cache: false,
            templateUrl: "templates/member/order/contract/contractSucc.htm",
            controller: 'ContractSuccessCtrl',
            requiredLogin: true
        })

        .state('contract_fail', {
            url: '/contract/fail',
            templateUrl: "templates/member/order/contract/contractFail.htm"
        })

        .state('member_payment', {
            url: '/payChoice/:orderId/:channel',
            cache: false,
            templateUrl: "templates/member/payment/payChoice.htm",
            controller: 'MemberPayCtrl',
            requiredLogin: true
        })

        .state('pay_success', {
            url: '/pay/success',
            cache: false,
            params: {orderId: null, channel: null},
            templateUrl: "templates/member/payment/paySuccess.htm",
            controller: 'PayResultCtrl'
        })

        .state('pay_error', {
            url: '/pay/error',
            cache: false,
            templateUrl: "templates/member/payment/payError.htm",
            controller: 'PayResultCtrl'
        })

        .state('member_login', {
            url: '/member/login',
            cache: false,
            params: {last: null, params: null},
            templateUrl: "templates/member/login/login.htm",
            controller: 'MemberLoginCtrl'
        })

        .state('user_activation', {
            url: '/user/activation',
            cache: false,
            params: {last: null, params: null, userName: null, token: null},
            templateUrl: "templates/member/login/memActivation.htm",
            controller: 'MemberActivationCtrl'
        })

        .state('member_register', {
            url: '/member/register',
            cache: false,
            params: {last: null, params: null, mobile: null},
            templateUrl: "templates/member/register/register.htm",
            controller: "RegisterCtrl"
        })
        .state('member_registactivity', {
            url: '/member/registactivity',
            cache: false,
            params: {last: null, params: null, mobile: null},
            templateUrl: "templates/member/register/registactivity.htm",
            controller: "RegistactivityCtrl"
        })
        .state('member_registerSucc', {
            url: '/member/registerSucc',
            cache: false,
            params: {showFlag: false, registerType: null},
            templateUrl: "templates/member/register/registerSucc.htm",
            controller: "RegisterSuccCtrl"
        })


        .state('member_resetPassword', {
            url: '/member/resetPswd',
            templateUrl: "templates/member/resetPswd/getBackPassword.htm",
            controller: 'ResetPasswordCtrl',
            cache: false
        })

        // 修改积分使用密码
        .state('member_setIntPswd', {
            url: '/member/setIntPswd',
            templateUrl: "templates/member/resetPswd/setIntPswd.htm",
            controller: 'SetIntPswdCtrl',
            params: {stateName: null, param: '@param'},
            cache: false,
            requiredLogin: true
        })

        //配送地址
        .state('member-expression', {
            url: '/member/database/editExpression',
            params: {param: '@param'},
            templateUrl: "templates/member/database/expressionInfo.htm",
            controller: 'MemberExpressionCtrl',
            cache: false,
            requiredLogin: true
        })
        .state('member_newsNoti', {
            url: '/member/news/list',
            //cache: false,// 解决从公告详细页回到列表页页面重新加载的问题
            templateUrl: "templates/member/news/newsNotice.htm",
            controller: 'MemberNewsNotiCtrl',
            requiredLogin: true
        })
        .state('member_newsDetail', {
            url: '/member/news/detail/:news_id',
            cache: false,
            params: {news_id: '@param'},
            templateUrl: "templates/member/news/newsDetail.htm",
            controller: 'MemberNewsDetailCtrl',
            requiredLogin: true
        })
        // 私人订制
        .state('member_plan_add', {
            url: '/member/plan/add',
            params: {param: '@param'},
            templateUrl: "templates/member/plan/tourPlanAdd.htm",
            cache: false,
            controller: 'MemberPlanAddCtrl',
            requiredLogin: true
        })
        .state('member_plan_success', {
            url: '/member/plan/success',
            params: {param: '@param'},
            templateUrl: "templates/member/plan/tourPlanSuccess.htm",
            cache: false,
            controller: 'MemberPlanSuccessCtrl',
            requiredLogin: true
        })
        // 私人订制
        .state('member_plan_list', {
            url: '/member/plan/list',
            params: {param: '@param'},
            cache: false,
            templateUrl: "templates/member/plan/tourPlanList.htm",
            controller: 'MemberPlanListCtrl',
            requiredLogin: true
        })
        // 常用地址列表页面
        .state('member-address', {
            url: '/member/address/addressListInfo',
            params: {param: '@param'},
            templateUrl: "templates/member/address/addressListInfo.htm",
            controller: 'AddressListCtrl'
        })
        // 常用旅客信息列表页面
        .state('member-traver', {
            url: '/member/traver/traverListInfo',
            params: {param: '@param'},
            templateUrl: "templates/member/traver/traverListInfo.htm",
            cache: false,
            controller: 'TraverListCtrl'
        })
        // 优惠券信息列表
        .state('member_coupon', {
            url: '/member/coupon/list',
            templateUrl: "templates/member/coupon/couponList.htm",
            cache: false,
            controller: 'CouponListCtrl',
            requiredLogin: true
        })
        // 优惠券激活页面
        .state('member_activation', {
            url: '/member/coupon/activation',
            templateUrl: "templates/member/coupon/activation.htm",
            params: {codeNo: ''},
            cache: false,
            controller: 'CouponActivCtrl',
            requiredLogin: true
        })

        //我的出团通知
        .state('member_teamOffInfo', {
            url: '/member/tours/teamOffInfo',
            templateUrl: "templates/member/tours/teamOffInfo.htm",
            controller: 'MemberteamOffInfoCtrl',
            requiredLogin: true
        })
        //我的出团通知详细
        .state('member_teamOffDet', {
            url: '/member/tours/teamOffDet',
            templateUrl: "templates/member/tours/teamOffDet.htm",
            params: {params: '@params'},
            controller: 'MemberteamOffDetCtrl',
            requiredLogin: true
        })
        //我的行前说明会
        .state('member_teamMeetInfo', {
            url: '/member/tours/teamMeetInfo',
            templateUrl: "templates/member/tours/teamMeetInfo.htm",
            controller: 'MemberteamMeetInfoCtrl',
            requiredLogin: true
        })
        //个人设置
        .state('member_presonalInfo', {
            url: '/member/personalinfomodify/presonalInfo',
            templateUrl: "templates/member/personalinfomodify/presonalInfo.htm",
            controller: 'memberPersonalInfoCtrl',
            requiredLogin: true,
            cache: false
        })
        // 我的收藏列表
        .state('member_favorite', {
            url: '/member/favorite/list',
            templateUrl: "templates/member/favorite/myFavorList.htm",
            cache: false,
            controller: 'myFavorListCtrl',
            requiredLogin: true
        })
        // 我的额度
        .state('member_myAccount', {
            url: '/member/myAccount',
            templateUrl: "templates/member/myAccount/myAccount.htm",
            params: {'data': null},
            cache: false,
            controller: 'myAccountCtrl',
            requiredLogin: true
        })
        // 我的积分
        .state('member_integral_list', {
            url: '/member/integral/list',
            templateUrl: "templates/member/integral/integralList.htm",
            controller: 'IntegralListCtrl',
            requiredLogin: true
        })
        // 我的积分支付
        .state('member_integral_pay', {
            url: '/pay/integral',
            templateUrl: "templates/member/integral/integralPay.htm",
            controller: 'IntegralPayCtrl',
            params: {param: '@param'},
            cache: false,
            requiredLogin: true
        })
        // 积分申请确认
        .state('member_integral_confirm', {
            url: '/member/integral/confirm',
            templateUrl: "templates/member/integral/integralConfirm.htm",
            controller: 'IntegralConfirmCtrl',
            params: {param: '@param'},
            cache: false,
            requiredLogin: true
        })
        // 我的积分支付成功
        .state('member_pay_success', {
            url: '/member/pay/success',
            templateUrl: "templates/common/paySuccess.htm",
            params: {integralParam: ''},
            controller: 'IntegralPaySuccessCtrl',
            cache: false,
            requiredLogin: true
        })
        // 我的积分支付失败
        .state('member_pay_error', {
            url: '/member/pay/error',
            templateUrl: "templates/common/payError.htm",
            requiredLogin: true
        })
    /******************* 会员中心 结束 ********************/
    /*******************旅游用品用begin********************/
        // 旅游用品按类别查询商品列表页面
        .state('shop_search', {
            url: '/shop/:desturl',
            templateUrl: "templates/shop/shopSearch.htm",
            //cache: false,
            controller: 'ShopSearchCtrl'
        })
        // 旅游用品商品明细页面
        .state('shop_detail', {
            url: '/shop/detail/:id',
            templateUrl: "templates/shop/shopDetail.htm",
            //cache: false,
            controller: 'ShopDetailCtrl'
        })

        // 旅游用品预订页
        .state('shop_book', {
            url: '/shop/book/booking',
            params: {'loginJumpUrl': 'shop_book', 'bookingData': '@bookingData', 'orderInfo': '@orderInfo'},
            //{param: '@param'},
            templateUrl: "templates/shop/shopBooking.htm",
            controller: 'ShopBookCtrl',
            cache: false,
            requiredLogin: true
        })
    /*******************旅游用品用end********************/
    /*******************常用联系人用begin********************/
        // 常用联系人查询商品列表页面
        .state('traver_list', {
            url: '/member/database/traverListInfo',
            params: {param: '@param'},
            templateUrl: "templates/member/database/traverListInfo.htm",
            cache: false,
            controller: 'TraverListCtrl'
        })
    /*******************常用联系人用end********************/

        // 自由行频道页面跳转开始
        // 自由行详细页
        .state('free_detail', {
            url: '/free/detail/:id',
            templateUrl: "templates/free/detail.htm",
            //params: {param: '@param'},
            params: {'id': '@id', 'addMyFavorite': ''},
            // cache: false,// 预订须知页签点击费用说明后返回到详细页未停留在预订须知 所以去掉cache:false
            controller: 'FreeDetailCtrl'
        })
        // 自由行详细页说明(套餐说明,费用说明,签证信息,预订须知,目的地攻略,签约付款)
        .state('free_detail_description', {
            url: '/free/description/:id/:pageFlag',
            templateUrl: "templates/free/detailDescription.htm",
            params: {param: '@param'},
            controller: 'FreeDetailDescriptionCtrl'
        })
        // 自由行详细页日期选择
        .state('free_detail_date', {
            url: '/free/date/:id',
            templateUrl: "templates/free/detailDate.htm",
            params: {param: '@param'},
            cache: false,
            controller: 'FreeDetailDateCtrl'
        })
        // 自由行服务选择页(交通,酒店(酒店附加产品),旅游附加产品,其他附加产品)
        .state('free_choose', {
            url: '/free/choose',
            templateUrl: "templates/free/choose.htm",
            params: {param: '@param'},
            cache: false,
            controller: 'FreeChooseCtrl'
        })
        // 自由行预订页
        .state('free_book', {
            url: '/free/book',
            templateUrl: "templates/free/book.htm",
            params: {'loginJumpUrl': 'free_book', 'bookingData': '@bookingData', 'orderInfo': '@orderInfo'},
            cache: false,
            controller: 'FreeBookCtrl',
            requiredLogin: true
        })
        // 自由行频道页面跳转结束
        // 票务页面跳转开始
        //票务详细页面
        .state('ticket_detail', {
            url: '/ticket/detail/:routeid',
            templateUrl: "templates/ticket/ticketDetail.htm",
            //cache: false,
            controller: 'TicketDetailCtrl'
        })
        .state('ticket_book', {
            url: '/ticket/book/booking',
            templateUrl: "templates/ticket/ticketBook.htm",
            params: {'loginJumpUrl': 'ticket_book', 'bookingData': '@bookingData', 'orderInfo': '@orderInfo'},
            controller: 'TicketBookCtrl',
            cache: false,
            requiredLogin: true
        })
        // 票务页面跳转结束
        //市场活动页面跳转开始
        .state('market_activity', {
            url: '/market/list/:id',
            templateUrl: "templates/market/marketActivity.htm",
            cache: false,
            controller: 'MarketListCtrl'
        })
        //出行服务页面跳转开始
        .state('travel_services', {
            url: '/travelServices/init',
            templateUrl: "templates/travel/travelServices.htm",
            controller: 'TravelServicesCtrl'
        })
        //市场活动页面跳转结束
    /*******************爱旅行start********************/
        .state('ailvxing_list', {
            url: '/ailvxing/list',
            templateUrl: "templates/ailvxing/ailvxingList.htm",
            params: {param: '@param'},
            controller: 'AlxListCtrl'
        })
        .state('ailvxing_detail', {
            url: '/ailvxing/detail/:alxid',
            templateUrl: "templates/ailvxing/ailvxingDetail.htm",
            controller: 'AlxDetailCtrl'
        })
        // 国旅在线服务条款
        .state('help_contract', {
            url: '/help/contract',
            templateUrl: "templates/help/contract.htm"
        })
    /*******************旅行朋友圈start********************/
        .state('travel_add', {
            url: '/travel/add',
            templateUrl: "templates/trip/travelAdd.htm",
            cache: false,
            requiredLogin: true,
            controller: 'CircleAddCtrl',
        })
        .state('travel_circle_index', {
            url: '/travel/circle',
            templateUrl: "templates/trip/travelCircleIndex.htm",
            params: {'backViewId': '@backViewId'},
            //cache: false,
            controller: 'CircleIndexCtrl',
        })
        .state('travel_note_index', {
            url: '/travel/note',
            templateUrl: "templates/trip/travelNoteIndex.htm",
            params: {'backViewId': '@backViewId'},
            //cache: false,
            controller: 'NoteIndexCtrl'
        })
        .state('travel_circle_mine', {
            url: '/travel/circle/mine',
            templateUrl: "templates/trip/travelCircleIndexPerson.htm",
            params: {'backViewId': '@backViewId', 'isPerson': 'true', 'loginJumpUrl': 'travel_circle_mine'},
            controller: 'CircleIndexCtrl',
            //cache: false,
            requiredLogin: true
        })

        .state('travel_note_mine', {
            url: '/travel/note/mine',
            templateUrl: "templates/trip/travelNoteIndexPerson.htm",
            params: {'backViewId': '@backViewId', 'isPerson': 'true', 'loginJumpUrl': 'travel_note_mine'},
            controller: 'NoteIndexCtrl',
            //cache: false,
            requiredLogin: true
        })
        .state('travel_circle_detail', {
            url: '/travel/circle/:ID',
            templateUrl: "templates/trip/travelCircleDetail.htm",
            params: {'backViewId': '@backViewId'},
            cache: false,
            controller: 'CircleDetailCtrl'
        })
        .state('trip_addLike', {
            url: '/trip/ailxindex',
            templateUrl: "templates/trip/traveCircleIndex.htm",
            controller: 'CircleIndexCtrl',
            params: {'backViewId': '@backViewId', 'loginJumpUrl': 'travel_circle_index'}
        })
        .state('travel_note_detail', {
            url: '/travel/note/:ID',
            templateUrl: "templates/trip/travelNoteDetail.htm",
            params: {'backViewId': '@backViewId'},
            cache: false,
            controller: 'NoteDetailCtrl'
        })
        .state('travel_circle_list', {
            url: '/travel/circle/list/:keywords',
            templateUrl: "templates/trip/travelCircleList.htm",
            params: {'backViewId': '@backViewId'},
            controller: 'CircleListCtrl'
        })
        .state('travel_note_list', {
            url: '/travel/note/list/:keywords',
            templateUrl: "templates/trip/travelNoteList.htm",
            params: {'backViewId': '@backViewId'},
            controller: 'NoteListCtrl'
        })
        .state('travel_search', {
            url: '/travel/search',
            templateUrl: "templates/trip/travelSearch.htm",
            params: {'backViewId': '@backViewId', 'searchType': '@searchType'},
            controller: 'TravelSearchCtrl'
        })
        .state('LXQDel', {
            url: '/travel/circle/:ID',
            templateUrl: "templates/trip/travelCircleDetail.htm",
            controller: 'CircleDetailCtrl',
            params: {'backViewId': '@backViewId', 'loginJumpUrl': 'LXQDel'},
            cache: false,
            requiredLogin: true
        })
        .state('YJDel', {
            url: '/travel/circle/:ID',
            templateUrl: "templates/trip/travelNoteDetail.htm",
            controller: 'NoteDetailCtrl',
            params: {'backViewId': '@backViewId', 'loginJumpUrl': 'YJDel'},
            cache: false,
            requiredLogin: true
        })
        .state('travel_circle_index_tologin', {
            url: '/travel/circle',
            templateUrl: "templates/trip/travelCircleIndex.htm",
            params: {'backViewId': '@backViewId', 'loginJumpUrl': 'travel_circle_index_tologin'},
            cache: false,
            controller: 'CircleIndexCtrl',
            requiredLogin: true
        })
        .state('travel_circle_list_tologin', {
            url: '/travel/circle/list/:keywords',
            templateUrl: "templates/trip/travelCircleList.htm",
            params: {'backViewId': '@backViewId', 'loginJumpUrl': 'travel_circle_list_tologin'},
            controller: 'CircleListCtrl',
            requiredLogin: true
        })
    /*******************旅行朋友圈end********************/
        .state('wxPay', {
            url: '/member/wxPay/:orderId/:channel/:price',
            templateUrl: "templates/member/payment/wxPay.htm",
            cache: false,
            controller: 'WxPayCtrl'
        })
        .state('app_message', {
            url: '/app/message/:type',
            templateUrl: "templates/common/appMessage.htm",
            controller: 'AppMessageCtrl'
        })

    /*******************机票酒店 start********************/
        .state('flight_index', {
            url: '/flight/index',
            params: {queryData: null},
            templateUrl: "templates/flight/flightIndex.htm",
            cache: false,
            controller: 'FlightCtrl'
        })

        .state('flight_gj_first', {
            url: '/flight/gj/first',
            params: {queryData: null},
            templateUrl: "templates/flight/gj/gjFlightFirst.htm",
            cache: false,
            controller: 'GjFlightFirstCtrl'
        })

        .state('flight_gj_second', {
            url: '/flight/gj/second',
            params: {queryData: null},
            templateUrl: "templates/flight/gj/gjFlightSecond.htm",
            cache: false,
            controller: 'GjFlightSecondCtrl'
        })

        .state('flight_gn_query', {
            url: '/flight/gn/query',
            params: {queryData: null},
            templateUrl: "templates/flight/gn/gnFlightQuery.htm",
            cache: false,
            controller: 'GnFlightQueryCtrl'
        })

        .state('flight_gj_book', {
            url: '/flight/gj/booking',
            templateUrl: "templates/flight/gj/gjFlightBooking.htm",
            params: {
                'loginJumpUrl': 'flight_gj_book',
                bookingData: '@bookingData',
                'orderInfo': '@orderInfo',
            },
            cache: false,
            requiredLogin: true,
            controller: 'GJFlightBookCtrl'
        })

        .state('flight_gn_book', {
            url: '/flight/gn/booking',
            templateUrl: "templates/flight/gn/gnFlightBooking.htm",
            params: {
                'loginJumpUrl': 'flight_gn_book',
                bookingData: '@bookingData',
                'orderInfo': '@orderInfo',
            },
            cache: false,
            requiredLogin: true,
            controller: 'GNFlightBookCtrl'
        })

        // 机票预订成功页面
        .state('flight_success', {
            url: '/flight/book/success',
            templateUrl: "templates/flight/flightSuccess.htm",
            params: {bookingData: '@bookingData'},
            cache: false,
            controller: 'FlightSuccessCtrl'
        })

        //预订失败页面
        .state('flight_fail', {
            url: '/flight/fail',
            templateUrl: 'templates/flight/flightFail.htm',
            cache: false
        })

        .state('hotel_index', {
            url: '/hotel/index',
            templateUrl: "templates/hotel/hotelIndex.htm",
            cache: false,
            controller: 'HotelCtrl'
        })
        //国际酒店 列表页
        .state('ihotel_list', {
            url: '/ihotel/list/:url',
            params: {queryData: null},
            cache: false,
            templateUrl: "templates/hotel/gj/ihotelList.htm",
            controller: 'iHotelListCtrl'
        })
        .state('ihotel_detail', {
            url: '/ihotel/detail/:url',
            templateUrl: "templates/hotel/gj/ihotelDetail.htm",
            cache: false,
            controller: 'IHotelDetailCtrl'
        })
        .state('hotel_detail', {
            url: '/hotel/detail/:url',
            templateUrl: "templates/hotel/gn/hotelDetail.htm",
            cache: false,
            controller: 'HotelDetailCtrl'
        })
        .state('hotel_list', {
            url: '/hotel/list/:url',
            params: {queryData: null},
            templateUrl: "templates/hotel/gn/hotelList.htm",
            cache: false,
            controller: 'HotelListCtrl'
        })
        .state('hotel_book', {
            url: '/hotel/book',
            templateUrl: "templates/hotel/hotelBook.htm",
            params: {loginJumpUrl: 'hotel_book', orderInfo: '@orderInfo', bookingData: '@bookingData'},
            cache: false,
            requiredLogin: true,
            controller: 'HotelBookCtrl'
        })
        //预订成功页面
        .state('hotel_success', {
            url: '/hotel/success',
            templateUrl: 'templates/hotel/hotelSuccess.htm',
            cache: false,
            params: {orderParam: '@orderParam'},
            controller: 'HotelSuccessCtrl'
        })
        //预订成功页面
        .state('hotel_fail', {
            url: '/hotel/fail',
            templateUrl: 'templates/hotel/hotelFail.htm',
            cache: false
        })
        //BITE发码及抽奖
        .state('biteCoupon', {
            url: '/market/biteCoupon',
            templateUrl: 'templates/market/biteCoupon.htm',
            cache: false,
            controller: 'BiteGetCouponCtrl',
            requiredLogin: true
        })

        //进入抽奖页面
        .state('draw_index', {
            url: '/draw/:drawId',
            templateUrl: 'templates/common/draw.htm',
            cache: false,
            params: {'drawId': null, 'drawParam': null},
            controller: 'DrawCtrl',
            requiredLogin: true
        })

        .state('biteSign', {
            url: '/market/biteSign',
            templateUrl: 'templates/market/biteSign.htm',
            cache: false,
            controller: 'BiteSignCtrl',
            requiredLogin: true
        })

        //app下载地址
        .state('appDownload', {
            url: '/app/download',
            templateUrl: 'templates/common/appload.htm',
            controller: 'AppDownloadCtrl'
        })
        //实体卡激活广告
        .state('cardActivation_ad', {
            url: '/cardActivation/ad',
            controller: 'CardActivationCtrl',
            templateUrl: 'templates/member/cardActivation/cardAd.htm'
        })
        // 实体卡激活
        .state('cardActivation_activate', {
            url: '/cardActivation/activate',
            templateUrl: 'templates/member/cardActivation/cardActivate.htm',
            controller: 'CardActivationCtrl',
            requiredLogin: true
        })
        //客服着陆页
        .state('kefu_home',{
            url: '/kefu',
            templateUrl: 'templates/common/onlineQa.htm',
            cache: false,
            controller: 'KeFuHomeCtrl'
        })
        // 客服首页
        .state('kefu_index', {
            url: '/kefu/index',
            templateUrl: 'templates/common/kefuIndex.htm',
            controller: 'KeFuCtrl'
        })
        // 客户满意度调查-去评价
        .state('goToEvalute', {
            url: '/evalute/goToEvalute',
            templateUrl: 'templates/evalute/evaluteIndex.htm',
            controller: 'EvaluteCtrl',
            cache: false,
            requiredLogin: true,
            params: {evaluteParam: '@evaluteParam'}
        })
        // 客户满意度评价成功
        .state('evaluteSucc', {
            url: '/evalute/evaluteSucc',
            templateUrl: 'templates/evalute/evaluteSucc.htm',
            controller: 'EvaluteSuccCtrl',
            cache: false,
            requiredLogin: true,
            params: {evaluteParam: '@evaluteParam'}
        })

        /***********小黄车广告****************/
        .state('ofo_ad', {
            url: '/ofo/ad',
            templateUrl: 'templates/ad/ofoAd.htm',
            controller: 'OfoAdCtrl',
            cache: false,
            requiredLogin: true
        })
    ;
    $httpProvider.interceptors.push('httpInterceptor');
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
}]);

citsApp.factory('Cookies',['$cookies',function ($cookies) {
  
    var defaultOption = { path:'/',domain: 'm.cits.cn'};

    //var defaultOption = { path:'/'};
    return {
        set: function (key, data) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 30);
            defaultOption.expires=expireDate;
            return $cookies.put(key, data,defaultOption);
        },
        get: function (key) {
            return $cookies.get(key);
        },
        remove: function (key) {
            return $cookies.remove(key,defaultOption);
        }
    };
}]);

citsApp.factory('Storage', function () {
    return {
        set: function (key, data) {
            return CITS.Storage.set(key, data);
        },
        get: function (key) {
            return CITS.Storage.get(key);
        },
        remove: function (key) {
            return CITS.Storage.remove(key);
        }
    };
});
citsApp.factory('Session', function () {
    return {
        set: function (key, data) {
            return CITS.Session.set(key, data);
        },
        get: function (key) {
            return CITS.Session.get(key);
        },
        remove: function (key) {
            return CITS.Session.remove(key);
        }
    };
});
citsApp.factory('ServiceFactory', ['$resource', 'ENV', function ($resource, ENV) {
    return $resource(ENV.api, {}, {
        api: {
            method: 'post',
            params: {
                requestHeader: '@requestHeader',
                requestBody: '@requestBody'
            }
        }
    });
}]);
citsApp.factory('SearchServiceFactory', ['$resource', 'ENV', function ($resource, ENV) {
    return $resource(ENV.alapi, {}, {
        api: {
            method: 'post',
            params: {
                requestHeader: '@requestHeader',
                requestBody: '@requestBody'
            }
        }
    });
}]);
citsApp.factory('httpInterceptor', ['HostFactory', 'Session', 'ENV', '$q', '$injector', function (HostFactory, Session, ENV, $q, $injector) {
    var httpInterceptor = {
        request: function (config) {
            console.log;
            if (config.url.indexOf('app/api.html') > 0 || config.url.indexOf('api.html') > 0) {
                var host = HostFactory.getHostDomain();
                var csrfToken = Session.get(ENV.CSRF_TOKEN_KEY);
                var userInfo = $injector.get('CommonFactory').getUserInfo() || "";

                config.params.requestHeader.site = HostFactory.getHostDomain();
                config.params.requestHeader.user = CITS.getUser();
                config.params.requestHeader.csrfToken = csrfToken;
                config.params.requestHeader.deviceId = CITS.info.unique;

                if (userInfo) {
                    config.params.requestHeader.loginToken = userInfo.loginToken;
                    config.params.requestHeader.loginId = userInfo.loginId;
                }
            }
            return config;
        },
        response: function (config) {
            state = $injector.get('$state');
            if (!config) {
                $injector.get('$state').go("net");
            }

            if (config.config.url.indexOf('app/api.html') > 0) {
                var msgId = config.data.msgId;
                if (msgId == '0') {
                    $injector.get('$state').go("member_login");
                    return $q.reject(config);
                } else if (msgId == '2') {
                    $injector.get('$state').go("auth");
                    return $q.reject(config);
                    // return config;
                } else if (msgId == '8') {
                    HostFactory.removePersonShopUser();
                    $injector.get('$state').go("werror");
                    return $q.reject(config);
                    // return config;
                } else if (msgId == '9') {
                    $injector.get('$state').go("error");
                    return $q.reject(config);
                    // return config;
                } else if (msgId == '1') {
                    Session.set(ENV.CSRF_TOKEN_KEY, config.data.csrfToken);
                }

            }
            return config;
        }
        ,
        requestError: function (config) {
            $injector.get('$rootScope').$broadcast('loading:hide');
            console.log("requestError:" + config);
            $injector.get('$state').go("net");
        }
        ,
        responseError: function (config) {
            $injector.get('$rootScope').$broadcast('loading:hide');
            console.log("responseError:" + config);

            //$injector.get('$state').go("net");
            return config;

        }
    };

    return httpInterceptor;
}]);