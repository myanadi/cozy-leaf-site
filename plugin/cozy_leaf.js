//@name cozy_leaf
//@display-name 🌿Cozy-Leaf
//@api 3.0
//@version 0.7.6
//@description 세이브 있는 챗에서만 작동 · 연구 명성 체크

(async () => {
  const risuai = Risuai;

  // ═══════════════════════════════════════════════════════════════
  // 1. 데이터
  // ═══════════════════════════════════════════════════════════════

  // 기본 제빵 (베이스빵 = freeform 제외 11종)
  const RECIPES = [
    { name: '식빵',         icon: '🍞', repReq: 0,   price: 20,  ap: 2, mat: {밀가루:2, 버터:1, 설탕:1} },
    { name: '쿠키',         icon: '🍪', repReq: 0,   price: 15,  ap: 2, mat: {밀가루:1, 버터:1, 설탕:1} },
    { name: '머핀',         icon: '🧁', repReq: 20,  price: 30,  ap: 2, mat: {밀가루:1, 버터:1, 계란:1, 설탕:1} },
    { name: '마들렌',       icon: '🐚', repReq: 20,  price: 35,  ap: 2, mat: {밀가루:1, 버터:2, 계란:1, 설탕:1} },
    { name: '바게트',       icon: '🥖', repReq: 40,  price: 45,  ap: 2, mat: {밀가루:3, 설탕:1} },
    { name: '브리오슈',     icon: '🥯', repReq: 40,  price: 50,  ap: 2, mat: {밀가루:2, 버터:3, 계란:2, 설탕:2} },
    { name: '크루아상',     icon: '🥐', repReq: 60,  price: 55,  ap: 2, mat: {밀가루:2, 버터:3, 설탕:1, 계란:1} },
    { name: '퀸아망',       icon: '🍥', repReq: 60,  price: 85,  ap: 2, mat: {밀가루:2, 버터:4, 설탕:3, 계란:1} },
    { name: '롤케이크',     icon: '🎂', repReq: 80,  price: 100, ap: 2, mat: {밀가루:2, 버터:2, 계란:3, 설탕:2} },
    { name: '파운드케이크', icon: '🍰', repReq: 80,  price: 90,  ap: 2, mat: {밀가루:2, 버터:3, 계란:3, 설탕:3} },
    { name: '부쉬드노엘',   icon: '🪵', repReq: 100, price: 180, ap: 2, mat: {밀가루:3, 버터:4, 계란:4, 설탕:3} },
    { name: '자유 창작',    icon: '✨', repReq: 100, price: 100, ap: 2, mat: {밀가루:2, 버터:2, 계란:2, 설탕:2}, freeform: true },
  ];

  // 베이스빵 = RECIPES에서 freeform 제외
  const BASE_BREADS = RECIPES.filter(r => !r.freeform);

  const BASIC_MAT = ['밀가루', '버터', '계란', '설탕'];
  const MAT_ICON = { 밀가루: '🌾', 버터: '🧈', 계란: '🥚', 설탕: '🍬' };
  const MAT_PRICES = { 밀가루: 2, 버터: 5, 계란: 3, 설탕: 2 };

  // 연구 특수재료 표준 개수
  const SPECIAL_INGR_STANDARD = {
    '행운의 열매': 5,
    '사랑의 열매': 5,
    '숙면의 열매': 5,
    '원기의 열매': 5,
    '용기의 열매': 5,
    '민들레': 5,
    '박하잎': 4,
    '산딸기': 4,
    '야생 블루베리': 4,
    '야생꿀': 2,
  };

  // 연구 특수재료 순서 (UI 표시용)
  const SPECIAL_INGREDIENTS = [
    { name: '행운의 열매',   icon: '💚', category: 'magic',  effect: '행운' },
    { name: '사랑의 열매',   icon: '❤️', category: 'magic',  effect: '사랑' },
    { name: '숙면의 열매',   icon: '💜', category: 'magic',  effect: '숙면' },
    { name: '원기의 열매',   icon: '💙', category: 'magic',  effect: '원기' },
    { name: '용기의 열매',   icon: '💛', category: 'magic',  effect: '용기' },
    { name: '민들레',        icon: '🌼', category: 'forage', effect: null },
    { name: '박하잎',        icon: '🌱', category: 'forage', effect: null },
    { name: '산딸기',        icon: '🍓', category: 'forage', effect: null },
    { name: '야생 블루베리', icon: '🫐', category: 'forage', effect: null },
    { name: '야생꿀',        icon: '🍯', category: 'forage', effect: null },
  ];

  // 연구 레시피 30개 (마법빵 20 + 채집빵 10)
  // unlockByRep 있는 5개는 명성 60 자동 언락
  const RESEARCH_RECIPES = [
    // 💚 행운 (별빛) 4종
    { id:'star_madeleine',    name:'별빛 마들렌',     icon:'💫🐚', base:'마들렌',       special:'행운의 열매',   effect:'행운', price:250, category:'magic', unlockByRep:60 },
    { id:'star_cookie',       name:'별빛 쿠키',       icon:'💫🍪', base:'쿠키',         special:'행운의 열매',   effect:'행운', price:180, category:'magic' },
    { id:'star_baguette',     name:'별빛 바게트',     icon:'💫🥖', base:'바게트',       special:'행운의 열매',   effect:'행운', price:260, category:'magic' },
    { id:'star_buche',        name:'별빛 부쉬드노엘', icon:'💫🪵', base:'부쉬드노엘',   special:'행운의 열매',   effect:'행운', price:550, category:'magic' },
    // ❤️ 사랑 (장미) 4종
    { id:'rose_muffin',       name:'장미 머핀',       icon:'🌹🧁', base:'머핀',         special:'사랑의 열매',   effect:'사랑', price:220, category:'magic', unlockByRep:60 },
    { id:'rose_madeleine',    name:'장미 마들렌',     icon:'🌹🐚', base:'마들렌',       special:'사랑의 열매',   effect:'사랑', price:240, category:'magic' },
    { id:'rose_brioche',      name:'장미 브리오슈',   icon:'🌹🥯', base:'브리오슈',     special:'사랑의 열매',   effect:'사랑', price:300, category:'magic' },
    { id:'rose_rollcake',     name:'장미 롤케이크',   icon:'🌹🎂', base:'롤케이크',     special:'사랑의 열매',   effect:'사랑', price:380, category:'magic' },
    // 💜 숙면 (달빛) 4종
    { id:'moon_pound',        name:'달빛 파운드',     icon:'🌙🍰', base:'파운드케이크', special:'숙면의 열매',   effect:'숙면', price:350, category:'magic', unlockByRep:60 },
    { id:'moon_cookie',       name:'달빛 쿠키',       icon:'🌙🍪', base:'쿠키',         special:'숙면의 열매',   effect:'숙면', price:180, category:'magic' },
    { id:'moon_madeleine',    name:'달빛 마들렌',     icon:'🌙🐚', base:'마들렌',       special:'숙면의 열매',   effect:'숙면', price:240, category:'magic' },
    { id:'moon_brioche',      name:'달빛 브리오슈',   icon:'🌙🥯', base:'브리오슈',     special:'숙면의 열매',   effect:'숙면', price:300, category:'magic' },
    // 💙 원기 (햇살) 4종
    { id:'sun_brioche',       name:'햇살 브리오슈',   icon:'🌻🥯', base:'브리오슈',     special:'원기의 열매',   effect:'원기', price:300, category:'magic', unlockByRep:60 },
    { id:'sun_muffin',        name:'햇살 머핀',       icon:'🌻🧁', base:'머핀',         special:'원기의 열매',   effect:'원기', price:220, category:'magic' },
    { id:'sun_croissant',     name:'햇살 크루아상',   icon:'🌻🥐', base:'크루아상',     special:'원기의 열매',   effect:'원기', price:320, category:'magic' },
    { id:'sun_rollcake',      name:'햇살 롤케이크',   icon:'🌻🎂', base:'롤케이크',     special:'원기의 열매',   effect:'원기', price:380, category:'magic' },
    // 💛 용기 (황금) 4종
    { id:'gold_croissant',    name:'황금 크루아상',   icon:'👑🥐', base:'크루아상',     special:'용기의 열매',   effect:'용기', price:320, category:'magic', unlockByRep:60 },
    { id:'gold_cookie',       name:'황금 쿠키',       icon:'👑🍪', base:'쿠키',         special:'용기의 열매',   effect:'용기', price:180, category:'magic' },
    { id:'gold_kouign',       name:'황금 퀸아망',     icon:'👑🍥', base:'퀸아망',       special:'용기의 열매',   effect:'용기', price:420, category:'magic' },
    { id:'gold_pound',        name:'황금 파운드',     icon:'👑🍰', base:'파운드케이크', special:'용기의 열매',   effect:'용기', price:350, category:'magic' },
    // 🌿 채집빵 10종
    { id:'dandelion_madeleine', name:'민들레 마들렌',   icon:'🌼🐚', base:'마들렌',       special:'민들레',        effect:null, price:100, category:'forage' },
    { id:'dandelion_pound',     name:'민들레 티 케이크', icon:'🌼🍰', base:'파운드케이크', special:'민들레',        effect:null, price:200, category:'forage' },
    { id:'mint_cookie',         name:'박하 쿠키',       icon:'🌱🍪', base:'쿠키',         special:'박하잎',        effect:null, price:80,  category:'forage' },
    { id:'mint_brioche',        name:'박하 브리오슈',   icon:'🌱🥯', base:'브리오슈',     special:'박하잎',        effect:null, price:180, category:'forage' },
    { id:'strawberry_muffin',   name:'산딸기 머핀',     icon:'🍓🧁', base:'머핀',         special:'산딸기',        effect:null, price:130, category:'forage' },
    { id:'strawberry_rollcake', name:'산딸기 롤케이크', icon:'🍓🎂', base:'롤케이크',     special:'산딸기',        effect:null, price:280, category:'forage' },
    { id:'blueberry_madeleine', name:'블루베리 마들렌', icon:'🫐🐚', base:'마들렌',       special:'야생 블루베리', effect:null, price:100, category:'forage' },
    { id:'blueberry_pound',     name:'블루베리 파운드', icon:'🫐🍰', base:'파운드케이크', special:'야생 블루베리', effect:null, price:260, category:'forage' },
    { id:'honey_brioche',       name:'야생꿀 브리오슈', icon:'🍯🥯', base:'브리오슈',     special:'야생꿀',        effect:null, price:240, category:'forage' },
    { id:'honey_croissant',     name:'야생꿀 크루아상', icon:'🍯🥐', base:'크루아상',     special:'야생꿀',        effect:null, price:260, category:'forage' },
  ];

  // v0.7 신규 - 공예 레시피 12개
  const CRAFT_RECIPES = [
    // 저가 (잡템 단독)
    { id: 'charm_rabbit',   name: '토끼털 부적',       icon: '🐰', tier: 'basic',   mat: { '토끼털': 3 },                            price: 80 },
    { id: 'charm_flower',   name: '마른 꽃잎 장식',    icon: '🌸', tier: 'basic',   mat: { '마른 꽃잎': 3 },                         price: 80 },
    { id: 'charm_moss',     name: '이끼 향낭',         icon: '🍄', tier: 'basic',   mat: { '이끼': 3 },                              price: 80 },
    { id: 'charm_bee',      name: '벌집 조각 부적',    icon: '🐝', tier: 'basic',   mat: { '벌집 조각': 3 },                         price: 100 },
    { id: 'charm_silver',   name: '은빛 털 목걸이',    icon: '🐺', tier: 'basic',   mat: { '은빛 털': 3 },                           price: 150 },
    { id: 'charm_slime',    name: '슬라임 젤리 구슬',  icon: '💧', tier: 'basic',   mat: { '슬라임 젤리': 2 },                       price: 120 },
    { id: 'charm_stone',    name: '돌조각 부적',       icon: '🗿', tier: 'basic',   mat: { '돌조각': 3 },                            price: 180 },
    { id: 'charm_dragon',   name: '용 이빨 목걸이',    icon: '🐉', tier: 'basic',   mat: { '용 이빨': 2 },                           price: 300 },
    // 특별품 (잡템 + 열매/채집)
    { id: 'special_luck',   name: '행운을 부르는 부적', icon: '💚', tier: 'special', mat: { '토끼털': 2, '행운의 열매': 2 },        price: 200 },
    { id: 'special_love',   name: '사랑을 담은 향낭',   icon: '❤️', tier: 'special', mat: { '마른 꽃잎': 2, '사랑의 열매': 2 },     price: 200 },
    { id: 'special_moon',   name: '달빛 아래 향초',     icon: '🌙', tier: 'special', mat: { '이끼': 2, '야생꿀': 1 },                price: 220 },
    { id: 'special_sun',    name: '햇살 담은 꿀단지',   icon: '🌻', tier: 'special', mat: { '벌집 조각': 2, '원기의 열매': 2 },     price: 250 },
  ];

  // v0.7 신규 - 게시판 퀘스트 30개
  const QUESTS = [
    // 🍞 배달 10
    { id: 'q_del_01', category: 'delivery', name: '아이의 소풍 도시락',   desc: '식빵 5개',                    type: 'item', requires: { '식빵': 5 },                    goldReward: 150,  repReward: 10 },
    { id: 'q_del_02', category: 'delivery', name: '아침 카페 주문',       desc: '쿠키 8개',                    type: 'item', requires: { '쿠키': 8 },                    goldReward: 200,  repReward: 10 },
    { id: 'q_del_03', category: 'delivery', name: '티타임 케이터링',      desc: '머핀 4개 + 마들렌 4개',       type: 'item', requires: { '머핀': 4, '마들렌': 4 },       goldReward: 300,  repReward: 15 },
    { id: 'q_del_04', category: 'delivery', name: '부부 기념일',          desc: '브리오슈 3개',                type: 'item', requires: { '브리오슈': 3 },                goldReward: 250,  repReward: 15 },
    { id: 'q_del_05', category: 'delivery', name: '마을 축제',            desc: '바게트 6개',                  type: 'item', requires: { '바게트': 6 },                  goldReward: 350,  repReward: 20 },
    { id: 'q_del_06', category: 'delivery', name: '귀족의 아침',          desc: '크루아상 5개',                type: 'item', requires: { '크루아상': 5 },                goldReward: 400,  repReward: 20 },
    { id: 'q_del_07', category: 'delivery', name: '신전 봉헌',            desc: '별빛 마들렌 2개',             type: 'item', requires: { '별빛 마들렌': 2 },             goldReward: 600,  repReward: 30 },
    { id: 'q_del_08', category: 'delivery', name: '연인의 프러포즈',      desc: '장미 머핀 3개',               type: 'item', requires: { '장미 머핀': 3 },               goldReward: 700,  repReward: 30 },
    { id: 'q_del_09', category: 'delivery', name: '병문안 선물',          desc: '햇살 브리오슈 2개',           type: 'item', requires: { '햇살 브리오슈': 2 },           goldReward: 700,  repReward: 30 },
    { id: 'q_del_10', category: 'delivery', name: '왕궁 만찬',            desc: '부쉬드노엘 1개 + 퀸아망 3개', type: 'item', requires: { '부쉬드노엘': 1, '퀸아망': 3 }, goldReward: 1200, repReward: 50 },
    // 🧿 부적 의뢰 10
    { id: 'q_ch_01', category: 'charm', name: '시험 앞둔 학생',       desc: '토끼털 부적 1개',                     type: 'item', requires: { '토끼털 부적': 1 },                                   goldReward: 150, repReward: 10 },
    { id: 'q_ch_02', category: 'charm', name: '첫사랑에 빠진 아이',   desc: '마른 꽃잎 장식 2개',                  type: 'item', requires: { '마른 꽃잎 장식': 2 },                                goldReward: 250, repReward: 10 },
    { id: 'q_ch_03', category: 'charm', name: '불면증 상인',          desc: '이끼 향낭 1개',                       type: 'item', requires: { '이끼 향낭': 1 },                                     goldReward: 200, repReward: 15 },
    { id: 'q_ch_04', category: 'charm', name: '양봉장 주인',          desc: '벌집 조각 부적 2개',                  type: 'item', requires: { '벌집 조각 부적': 2 },                                goldReward: 350, repReward: 15 },
    { id: 'q_ch_05', category: 'charm', name: '사냥꾼 길드',          desc: '은빛 털 목걸이 1개',                  type: 'item', requires: { '은빛 털 목걸이': 1 },                                goldReward: 300, repReward: 20 },
    { id: 'q_ch_06', category: 'charm', name: '어부의 부탁',          desc: '슬라임 젤리 구슬 2개',                type: 'item', requires: { '슬라임 젤리 구슬': 2 },                              goldReward: 350, repReward: 20 },
    { id: 'q_ch_07', category: 'charm', name: '여행자의 안녕',        desc: '돌조각 부적 1개',                     type: 'item', requires: { '돌조각 부적': 1 },                                   goldReward: 250, repReward: 15 },
    { id: 'q_ch_08', category: 'charm', name: '기사단장의 검 장식',   desc: '용 이빨 목걸이 1개',                  type: 'item', requires: { '용 이빨 목걸이': 1 },                                goldReward: 500, repReward: 30 },
    { id: 'q_ch_09', category: 'charm', name: '결혼 앞둔 신부',       desc: '행운을 부르는 부적 1 + 사랑을 담은 향낭 1', type: 'item', requires: { '행운을 부르는 부적': 1, '사랑을 담은 향낭': 1 }, goldReward: 700, repReward: 30 },
    { id: 'q_ch_10', category: 'charm', name: '왕비의 침실',          desc: '달빛 아래 향초 2개',                  type: 'item', requires: { '달빛 아래 향초': 2 },                                goldReward: 800, repReward: 40 },
    // 🌿 수집/사냥 10 (수집 6 + 사냥 4)
    { id: 'q_gh_01', category: 'gatherHunt', name: '약초상의 부탁',      desc: '민들레 5개',                     type: 'item', requires: { '민들레': 5 },                                          goldReward: 100, repReward: 5 },
    { id: 'q_gh_02', category: 'gatherHunt', name: '향수 공방',          desc: '박하잎 6개',                     type: 'item', requires: { '박하잎': 6 },                                          goldReward: 120, repReward: 5 },
    { id: 'q_gh_03', category: 'gatherHunt', name: '잼 만드는 할머니',   desc: '산딸기 5개 + 야생 블루베리 5개', type: 'item', requires: { '산딸기': 5, '야생 블루베리': 5 },                     goldReward: 250, repReward: 10 },
    { id: 'q_gh_04', category: 'gatherHunt', name: '양초 공방',          desc: '야생꿀 3개',                     type: 'item', requires: { '야생꿀': 3 },                                          goldReward: 250, repReward: 15 },
    { id: 'q_gh_05', category: 'gatherHunt', name: '정원사 협회',        desc: '밀 씨앗 3개',                    type: 'item', requires: { '밀 씨앗': 3 },                                         goldReward: 300, repReward: 15 },
    { id: 'q_gh_06', category: 'gatherHunt', name: '소녀의 첫사랑',      desc: '사랑의 열매 5개',                type: 'item', requires: { '사랑의 열매': 5 },                                     goldReward: 400, repReward: 15 },
    { id: 'q_gh_07', category: 'gatherHunt', name: '별토끼 개체수 조사', desc: '별토끼 3회 제압',                type: 'hunt', huntTarget: 'starrabbit', huntCount: 3,                              goldReward: 300, repReward: 20 },
    { id: 'q_gh_08', category: 'gatherHunt', name: '꿀벌요정 진정시키기', desc: '꿀벌요정 3회 제압',            type: 'hunt', huntTarget: 'beefairy',   huntCount: 3,                              goldReward: 400, repReward: 20 },
    { id: 'q_gh_09', category: 'gatherHunt', name: '은늑대 순찰',        desc: '은늑대 2회 제압',                type: 'hunt', huntTarget: 'silverwolf', huntCount: 2,                              goldReward: 500, repReward: 30 },
    { id: 'q_gh_10', category: 'gatherHunt', name: '아기 용 조사',       desc: '아기 용 1회 제압',               type: 'hunt', huntTarget: 'babydragon', huntCount: 1,                              goldReward: 800, repReward: 40 },
  ];

  const BOARD_REFRESH_DAYS = 3;
  const BOARD_UNLOCK_REP = 20;

  // v0.7.3 - 여행 (골드 싱크)
  const TRAVELS = [
    { id: 't_festival', icon: '🎪', name: '이웃 마을 축제',           desc: '하루쯤 문 닫고 축제 구경',       price: 30000 },
    { id: 't_stargazing', icon: '🌙', name: '별밤 관측 여행',          desc: '별무리 호수에서 별 헤아리기',     price: 80000 },
    { id: 't_hotspring', icon: '♨️', name: '마법숲 온천 하루',        desc: '온천물에 몸을 담그며 쉬어가기',   price: 180000 },
    { id: 't_lakehouse', icon: '🏡', name: '별무리 호숫가 별장',      desc: '이틀 밤 호숫가 별장에서 호캉스', price: 350000 },
    { id: 't_cruise',   icon: '🚤', name: '실베리아 강 크루즈',      desc: '강을 따라 사흘 여행',            price: 700000 },
    { id: 't_city',     icon: '🌆', name: '대도시 방문',              desc: '어머니 빵집에 안부 다녀오기',    price: 1500000 },
  ];

  // v0.7.5 - 특수 기념 아이템 (팔기/사기/만들기 전부 불가)
  const KEEPSAKE_TEACAN = '할머니의 홍차 캔';
  const KEEPSAKE_ITEMS = [KEEPSAKE_TEACAN];

  // v0.7.2 - 할머니의 조각 5개 (활동 마일스톤)
  const FRAGMENTS = [
    { key: 'settlement', name: '정착의 조각', icon: '🌾', color: '#B8967B', desc: '마을 사람들의 인정' },
    { key: 'garden',     name: '온기의 조각', icon: '🌸', color: '#D97B94', desc: '뒷마당에 다시 온기를' },
    { key: 'wolf',       name: '유대의 조각', icon: '🌙', color: '#9B7FBF', desc: '숲의 수호자와 마주함' },
    { key: 'mastery',    name: '숙련의 조각', icon: '⭐', color: '#E8A4BC', desc: '수많은 마법을 익힘' },
    { key: 'dragon',     name: '전설의 조각', icon: '👑', color: '#D9B04F', desc: '전설의 마물과 마주함' },
  ];

  const GRANDMA_LETTER = `나의 사랑스럽고 자랑스러운 손녀에게.

오븐에서 풍기는 고소한 빵 냄새가 이 낡은 종이까지 전해지는 것만 같구나.

네가 이 글을 읽고 있다는 건, 포근잎 마을에서의 다섯 걸음의 여정을 모두 마쳤다는 뜻이겠지?
마을 사람들의 인정을 얻고, 뒷마당에 다시 온기를 불러오고, 숲의 수호자를 만나고, 손끝으로 수많은 마법을 익히고, 마지막엔 전설의 마물과 마주하기까지…

예전에 네가 동그란 눈으로 '할머니, 궁극의 빵 레시피는 어디에 숨겨져 있어요?' 하고 물었던 거 기억하니?

할머니도 딱 너만 했을 땐, 그게 어느 깊은 숲속이나 낡은 마법책 구석에 적혀 있을 거라 믿었단다.
하지만 평생 손에 밀가루를 묻히며 화덕 앞을 지키다 보니 알게 되었지.

거창한 '궁극의 빵 레시피' 같은 건 애초에 없었단다.
네가 이웃들의 이야기에 귀 기울이고, 그들을 생각하며 따뜻한 온기로 구워낸 빵들…
그 다정한 마음의 조각들이 모인 것이 바로 마법 그 자체란다.

누군가의 행운을 빌어주고, 사랑을 전하고, 지친 밤엔 푹 자게 다독이고, 넘어진 이를 일으켜 세우며 다시 나아갈 용기를 주는 일.
그게 우리 마녀 제빵사들이 부릴 수 있는 가장 아름다운 기적이거든.

할머니가 참 많이 사랑했던 포근잎 마을 사람들을, 이제 우리 예쁜 손녀에게 부탁하마.
네가 굽는 빵 냄새를 맡고 찾아올 이웃들이 얼마나 좋은 사람들인지, 화덕 앞에 서면 금세 알게 될 거야.

화덕의 온기가 언제나 널 지켜주기를.

널 세상에서 가장 사랑하는 할머니가.

P.S.
뒷마당 텃밭, 세 번째 고랑 아래를 파보렴,
네가 갓 구운 빵이랑 곁들여 먹으면 딱 좋을, 할머니가 제일 아끼던 낡은 홍차 캔을 하나 숨겨두었단다.
바쁘더라도 가끔은 숲의 바람을 맞으며 향긋하게 쉬렴.`;

  const SKILLS = [
    { key: 'baking',    label: '빵 굽기',     icon: '🥐' },
    { key: 'research',  label: '레시피 연구', icon: '🔬' },
    { key: 'foraging',  label: '채집',        icon: '🌿' },
    { key: 'adventure', label: '모험',        icon: '🗡' },
    { key: 'gardening', label: '정원',        icon: '🌱' },
    { key: 'crafting',  label: '공예',        icon: '🧿' },
  ];

  const ACTIVITIES = [
    { id: 'bake',     icon: '🥐', label: '제빵',        desc: '오븐 굽기',       ap: null, locked: false },
    { id: 'sell',     icon: '☼',  label: '영업',        desc: '가게 문 열기',    ap: 0,    locked: false },
    { id: 'out',      icon: '🚪', label: '외출',        desc: '잠깐 다녀오기',   ap: null, locked: false },
    { id: 'adv',      icon: '🗺', label: '모험',        desc: '숲으로 떠나기',   ap: null, locked: false },
    { id: 'garden',   icon: '🌱', label: '정원',        desc: '오두막 뒷마당',   ap: null, locked: true },
    { id: 'research', icon: '🔬', label: '레시피 연구', desc: '재료를 조합해봐', ap: 3,    locked: false },
    { id: 'craft',    icon: '🧿', label: '공예',        desc: '부적·장식품',     ap: 2,    locked: false },
    { id: 'quest',    icon: '📋', label: '의뢰 게시판', desc: '3일마다 새 의뢰', ap: 0,    locked: true },
    { id: 'travel',   icon: '🎫', label: '여행',        desc: '골드로 휴가 다녀오기', ap: 0, locked: false },
  ];

  const OUT_SUBS = [
    { id: 'shop', icon: '🛒', label: '장보기', desc: '식료품점', ap: 1, locked: false },
  ];

  const ADV_SUBS = [
    { id: 'forage', icon: '🌿', label: '채집', desc: '숲을 거닐기',     ap: 2, locked: false },
    { id: 'hunt',   icon: '🗡', label: '사냥', desc: '마물과 마주치기', ap: 3, locked: false },
  ];

  const MOBS = [
    { id: 'starrabbit',  name: '별토끼',    icon: '🌟', unlockLv: 1, win: 0.65, dropRate: 0.6, seedDropRate: 0.15,
      drop: '행운의 열매', effect: '행운', heart: '💚', seedId: 'lucky',   junk: '토끼털',      junkPrice: 10 },
    { id: 'flowerfairy', name: '꽃요정',    icon: '🌸', unlockLv: 1, win: 0.60, dropRate: 0.6, seedDropRate: 0.15,
      drop: '사랑의 열매', effect: '사랑', heart: '❤️', seedId: 'love',    junk: '마른 꽃잎',   junkPrice: 10 },
    { id: 'mushroom',    name: '버섯정령',  icon: '🍄', unlockLv: 2, win: 0.60, dropRate: 0.5, seedDropRate: 0.15,
      drop: '숙면의 열매', effect: '숙면', heart: '💜', seedId: 'sleep',   junk: '이끼',        junkPrice: 10 },
    { id: 'beefairy',    name: '꿀벌요정',  icon: '🐝', unlockLv: 2, win: 0.55, dropRate: 0.5, seedDropRate: 0.15,
      drop: '원기의 열매', effect: '원기', heart: '💙', seedId: 'vitality', junk: '벌집 조각',   junkPrice: 10 },
    { id: 'silverwolf',  name: '은늑대',    icon: '🐺', unlockLv: 3, win: 0.45, dropRate: 0.5, seedDropRate: 0.10,
      drop: '용기의 열매', effect: '용기', heart: '💛', seedId: 'courage', junk: '은빛 털',     junkPrice: 20 },
    { id: 'slime',       name: '슬라임',    icon: '💧', unlockLv: 4, win: 0.40, dropRate: 0.4, seedDropRate: 0,
      drop: '슬라임 결정', effect: null, heart: null, seedId: null, junk: '슬라임 젤리', junkPrice: 25 },
    { id: 'mossgolem',   name: '이끼 골렘', icon: '🗿', unlockLv: 6, win: 0.35, dropRate: 0.3, seedDropRate: 0,
      drop: '마법석',      effect: null, heart: null, seedId: null, junk: '돌조각',      junkPrice: 30 },
    { id: 'babydragon',  name: '아기 용',   icon: '🐉', unlockLv: 8, win: 0.30, dropRate: 0.25, seedDropRate: 0,
      drop: '용비늘',      effect: null, heart: null, seedId: null, junk: '용 이빨',     junkPrice: 50 },
  ];

  const FORAGE_ITEMS = [
    { id: 'dandelion',  name: '민들레',        icon: '🌼', unlockLv: 1, weight: 30, price: 10 },
    { id: 'mint',       name: '박하잎',        icon: '🌱', unlockLv: 1, weight: 25, price: 10 },
    { id: 'strawberry', name: '산딸기',        icon: '🍓', unlockLv: 2, weight: 20, price: 15 },
    { id: 'blueberry',  name: '야생 블루베리', icon: '🫐', unlockLv: 3, weight: 15, price: 15 },
    { id: 'honey',      name: '야생꿀',        icon: '🍯', unlockLv: 5, weight: 5,  price: 25 },
  ];

  const SEEDS = [
    { id: 'wheat',    name: '밀 씨앗',           icon: '🌾', yields: '밀가루',       buyPrice: 30 },
    { id: 'cane',     name: '사탕수수 씨앗',    icon: '🎋', yields: '설탕',         buyPrice: 30 },
    { id: 'lucky',    name: '행운의 열매 씨앗', icon: '💚', yields: '행운의 열매',   buyPrice: null },
    { id: 'love',     name: '사랑의 열매 씨앗', icon: '❤️', yields: '사랑의 열매',   buyPrice: null },
    { id: 'sleep',    name: '숙면의 열매 씨앗', icon: '💜', yields: '숙면의 열매',   buyPrice: null },
    { id: 'vitality', name: '원기의 열매 씨앗', icon: '💙', yields: '원기의 열매',   buyPrice: null },
    { id: 'courage',  name: '용기의 열매 씨앗', icon: '💛', yields: '용기의 열매',   buyPrice: null },
  ];

  const ANIMALS = [
    { id: 'chicken', name: '닭', icon: '🐔', yields: '계란', buyPrice: 500 },
    { id: 'cow',     name: '소', icon: '🐄', yields: '버터', buyPrice: 800 },
  ];

  const BAKE_SESSION_MAX = 10;
  const FAVORITES_MAX = 6;
  const SKILL_MAX_LV = 10;
  const EXP_PER_ACTION = 10;
  const GARDEN_CYCLE_DAYS = 3;
  const ANIMAL_MAX_STORE = 3;

  const DROP_RENAME = {
    '별가루':     '행운의 열매',
    '꽃잎':       '사랑의 열매',
    '버섯 포자':  '숙면의 열매',
    '꿀방울':     '원기의 열매',
    '늑대 발톱':  '용기의 열매',
  };

  const DEFAULT_STATE = {
    uuid: null,
    day: 1,
    season: '봄',
    weather: '맑음',
    ap: 10,
    apMax: 10,
    gold: 200,
    reputation: 0,
    injured: false,
    inventory: { 밀가루: 20, 버터: 10, 계란: 10, 설탕: 10 },
    display: {},
    garden: [null, null, null],
    log: [],
    skills: {
      baking:    { lv: 1, exp: 0 },
      research:  { lv: 1, exp: 0 },
      foraging:  { lv: 1, exp: 0 },
      adventure: { lv: 1, exp: 0 },
      gardening: { lv: 1, exp: 0 },
      crafting:  { lv: 1, exp: 0 },
    },
    codex: {
      mobs: {},
      forages: {},
    },
    researched: {},      // v0.6 - 발견한 연구 레시피 { id: true }
    favorites: [],        // v0.6 - 즐겨찾기 빵 이름 배열 (최대 6)
    previousSnapshot: null, // v0.6 - 큐 undo용
    boardQuests: [],      // v0.7 - 게시판에 노출된 퀘스트 id 배열 (최대 3)
    activeQuest: null,    // v0.7 - 진행 중인 퀘스트 { id, acceptedDay, huntBaseline }
    boardRefreshDay: 0,   // v0.7 - 마지막 게시판 갱신 일자
    fragments: {          // v0.7.2 - 활동 마일스톤 조각 5개
      settlement: false, garden: false, wolf: false, mastery: false, dragon: false,
    },
    letterUnlocked: false, // v0.7.1 - 편지 해금 여부
  };

  // ═══════════════════════════════════════════════════════════════
  // 2. 챗방 UUID
  // ═══════════════════════════════════════════════════════════════

  let cachedUUID = null;
  let cachedPos = null;

  async function getChatUUID() {
    try {
      const charIdx = await risuai.getCurrentCharacterIndex();
      const chatIdx = await risuai.getCurrentChatIndex();
      if (!cachedPos || cachedPos.charIdx !== charIdx || cachedPos.chatIdx !== chatIdx) {
        cachedUUID = null;
        cachedPos = { charIdx, chatIdx };
      }
      if (cachedUUID) return cachedUUID;
      const chat = await risuai.getChatFromIndex(charIdx, chatIdx);
      if (!chat) return null;
      if (!chat.cozy_bakery_uuid) {
        chat.cozy_bakery_uuid = crypto.randomUUID();
        await risuai.setChatToIndex(charIdx, chatIdx, chat);
      }
      cachedUUID = chat.cozy_bakery_uuid;
      return cachedUUID;
    } catch (e) {
      console.error('[cozy_bakery] UUID 실패', e);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. 상태 저장/로드 (+ 마이그레이션)
  // ═══════════════════════════════════════════════════════════════

  async function getStorageKey() {
    const uuid = await getChatUUID();
    return uuid ? `cozy_bakery_save:${uuid}` : null;
  }

  function migrateInventory(inv) {
    const newInv = {};
    for (const [name, qty] of Object.entries(inv)) {
      const newName = DROP_RENAME[name] || name;
      newInv[newName] = (newInv[newName] || 0) + qty;
    }
    return newInv;
  }

  function mergeWithDefault(s) {
    const def = structuredClone(DEFAULT_STATE);
    const rawInv = { ...def.inventory, ...(s.inventory || {}) };
    return {
      ...def, ...s,
      inventory: migrateInventory(rawInv),
      display: { ...(s.display || {}) },
      garden: Array.isArray(s.garden) && s.garden.length === 3 ? s.garden : [null, null, null],
      skills: {
        baking:    { ...def.skills.baking,    ...(s.skills?.baking    || {}) },
        research:  { ...def.skills.research,  ...(s.skills?.research  || {}) },
        foraging:  { ...def.skills.foraging,  ...(s.skills?.foraging  || {}) },
        adventure: { ...def.skills.adventure, ...(s.skills?.adventure || s.skills?.hunting || {}) },
        gardening: { ...def.skills.gardening, ...(s.skills?.gardening || {}) },
        crafting:  { ...def.skills.crafting,  ...(s.skills?.crafting  || {}) },
      },
      codex: {
        mobs:    { ...(s.codex?.mobs    || {}) },
        forages: { ...(s.codex?.forages || {}) },
      },
      log: s.log || [],
      researched: s.researched || {},
      favorites: Array.isArray(s.favorites) ? s.favorites.slice(0, FAVORITES_MAX) : [],
      previousSnapshot: s.previousSnapshot || null,
      boardQuests: Array.isArray(s.boardQuests) ? s.boardQuests : [],
      activeQuest: s.activeQuest || null,
      boardRefreshDay: typeof s.boardRefreshDay === 'number' ? s.boardRefreshDay : 0,
      fragments: { ...def.fragments, ...(s.fragments || {}) },
      letterUnlocked: !!s.letterUnlocked,
    };
  }

  async function loadState() {
    try {
      const key = await getStorageKey();
      if (!key) return structuredClone(DEFAULT_STATE);
      const raw = await risuai.pluginStorage.getItem(key);
      if (!raw) return structuredClone(DEFAULT_STATE);
      return mergeWithDefault(JSON.parse(raw));
    } catch (e) {
      console.error('[cozy_bakery] 로드 실패', e);
      return structuredClone(DEFAULT_STATE);
    }
  }

  // v0.7.6 - 이 챗에 코지리프 세이브가 있는지 확인 (다른 캐릭터 챗에 상태 블록 안 붙게)
  async function hasSaveData() {
    try {
      const key = await getStorageKey();
      if (!key) return false;
      const raw = await risuai.pluginStorage.getItem(key);
      return !!raw;
    } catch (e) {
      return false;
    }
  }

  async function saveState(state) {
    try {
      const key = await getStorageKey();
      if (!key) return;
      await risuai.pluginStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error('[cozy_bakery] 저장 실패', e);
    }
  }

  async function resetState() {
    await saveState(structuredClone(DEFAULT_STATE));
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. 스킬
  // ═══════════════════════════════════════════════════════════════

  function expForNext(lv) { return lv * lv * 30; }

  function addSkillExp(state, key, amount) {
    const sk = state.skills[key];
    if (!sk || sk.lv >= SKILL_MAX_LV) return { leveledUp: false, newLevel: sk?.lv };
    sk.exp += amount;
    let leveledUp = false;
    while (sk.exp >= expForNext(sk.lv) && sk.lv < SKILL_MAX_LV) {
      sk.exp -= expForNext(sk.lv);
      sk.lv++;
      leveledUp = true;
    }
    if (sk.lv >= SKILL_MAX_LV) sk.exp = 0;
    return { leveledUp, newLevel: sk.lv };
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. 아이템 유틸
  // ═══════════════════════════════════════════════════════════════

  function itemCategory(name) {
    if (KEEPSAKE_ITEMS.includes(name)) return 'keepsake';
    if (BASIC_MAT.includes(name)) return 'basic';
    if (FORAGE_ITEMS.find(f => f.name === name)) return 'forage';
    if (SEEDS.find(s => s.name === name)) return 'seed';
    if (ANIMALS.find(a => a.name === name)) return 'animal';
    if (CRAFT_RECIPES.find(r => r.name === name)) return 'craft';
    if (MOBS.find(m => m.drop === name && m.effect)) return 'magic';
    if (MOBS.find(m => m.junk === name)) return 'junk';
    if (MOBS.find(m => m.drop === name)) return 'magicRaw';
    return 'other';
  }

  function itemIcon(name) {
    if (name === KEEPSAKE_TEACAN) return '🫖';
    if (MAT_ICON[name]) return MAT_ICON[name];
    const fg = FORAGE_ITEMS.find(f => f.name === name);
    if (fg) return fg.icon;
    const seed = SEEDS.find(s => s.name === name);
    if (seed) return seed.icon;
    const animal = ANIMALS.find(a => a.name === name);
    if (animal) return animal.icon;
    const craft = CRAFT_RECIPES.find(r => r.name === name);
    if (craft) return craft.icon;
    const mob = MOBS.find(m => m.drop === name);
    if (mob?.heart) return mob.heart;
    return '📦';
  }

  function itemPrice(name) {
    if (MAT_PRICES[name]) return MAT_PRICES[name];
    const fg = FORAGE_ITEMS.find(f => f.name === name);
    if (fg) return fg.price;
    const seed = SEEDS.find(s => s.name === name);
    if (seed?.buyPrice) return seed.buyPrice;
    const animal = ANIMALS.find(a => a.name === name);
    if (animal) return animal.buyPrice;
    const craft = CRAFT_RECIPES.find(r => r.name === name);
    if (craft) return craft.price;
    const mob = MOBS.find(m => m.junk === name);
    if (mob) return mob.junkPrice;
    return 0;
  }

  function isDiscovered(state, count) {
    return count > 0;
  }

  function getGardenMaxSlots(gardeningLv) {
    if (gardeningLv >= 6) return 3;
    if (gardeningLv >= 3) return 2;
    return 1;
  }

  function isGardenUnlocked(state) {
    return state.skills.foraging.lv >= 3;
  }

  function getSeedYieldAmount(gardeningLv) {
    if (gardeningLv >= 10) return 2 + Math.floor(Math.random() * 2);
    if (gardeningLv >= 5)  return 1 + Math.floor(Math.random() * 2);
    return 1;
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. 연구 유틸
  // ═══════════════════════════════════════════════════════════════

  // 특정 베이스빵 + 특수재료 조합 → 매칭 레시피 찾기
  function findResearchRecipe(baseName, specialName) {
    return RESEARCH_RECIPES.find(r => r.base === baseName && r.special === specialName);
  }

  // 발견된 레시피 세트 반환 (연구 발견 + 명성 자동 언락)
  function getDiscoveredResearch(state) {
    const set = new Set();
    for (const r of RESEARCH_RECIPES) {
      if (state.researched?.[r.id]) set.add(r.id);
      if (r.unlockByRep && state.reputation >= r.unlockByRep) set.add(r.id);
    }
    return set;
  }

  // 발견된 레시피 목록 (제빵 탭 표시용)
  function getUnlockedResearchRecipes(state) {
    const discovered = getDiscoveredResearch(state);
    return RESEARCH_RECIPES.filter(r => discovered.has(r.id));
  }

  // 연구 레시피의 전체 재료 (베이스 + 특수)
  function getResearchRecipeMat(recipe) {
    const base = BASE_BREADS.find(b => b.name === recipe.base);
    if (!base) return {};
    const specialQty = SPECIAL_INGR_STANDARD[recipe.special] || 5;
    return { ...base.mat, [recipe.special]: specialQty };
  }

  // 특수재료별 그룹 (도감용)
  function getResearchByIngredient() {
    const groups = {};
    for (const ing of SPECIAL_INGREDIENTS) {
      groups[ing.name] = {
        ingredient: ing,
        recipes: RESEARCH_RECIPES.filter(r => r.special === ing.name),
      };
    }
    return groups;
  }

  // ═══════════════════════════════════════════════════════════════
  // 6-B. 공예 · 퀘스트 유틸 (v0.7)
  // ═══════════════════════════════════════════════════════════════

  function categoryLabel(cat) {
    return { delivery: '🍞 배달', charm: '🧿 부적 의뢰', gatherHunt: '🌿 수집/사냥' }[cat] || cat;
  }

  function isQuestComplete(state, quest) {
    if (!quest) return false;
    if (quest.type === 'item') {
      for (const [name, count] of Object.entries(quest.requires)) {
        const has = (state.inventory[name] || 0) + (state.display[name] || 0);
        if (has < count) return false;
      }
      return true;
    }
    if (quest.type === 'hunt') {
      const killed = state.codex.mobs[quest.huntTarget]?.killed || 0;
      const baseline = state.activeQuest?.huntBaseline || 0;
      return (killed - baseline) >= quest.huntCount;
    }
    return false;
  }

  function consumeForQuest(state, requires) {
    for (const [name, count] of Object.entries(requires)) {
      let remaining = count;
      const invHave = state.inventory[name] || 0;
      const invTake = Math.min(remaining, invHave);
      state.inventory[name] = invHave - invTake;
      if (state.inventory[name] <= 0) delete state.inventory[name];
      remaining -= invTake;
      if (remaining > 0) {
        const dispHave = state.display[name] || 0;
        const dispTake = Math.min(remaining, dispHave);
        state.display[name] = dispHave - dispTake;
        if (state.display[name] <= 0) delete state.display[name];
      }
    }
  }

  function rollNewBoardQuests() {
    const del = QUESTS.filter(q => q.category === 'delivery');
    const charm = QUESTS.filter(q => q.category === 'charm');
    const gh = QUESTS.filter(q => q.category === 'gatherHunt');
    return [
      del[Math.floor(Math.random() * del.length)].id,
      charm[Math.floor(Math.random() * charm.length)].id,
      gh[Math.floor(Math.random() * gh.length)].id,
    ];
  }

  // v0.7.2 조각 체크 - 활동 마일스톤 기반
  function checkFragments(state) {
    const newlyEarned = [];

    // 🌾 정착: 명성 40
    if (!state.fragments.settlement && state.reputation >= 40) {
      state.fragments.settlement = true;
      newlyEarned.push(FRAGMENTS.find(f => f.key === 'settlement'));
    }
    // 🌸 온기: 정원 슬롯 하나라도 사용 중
    if (!state.fragments.garden && state.garden.some(slot => slot !== null)) {
      state.fragments.garden = true;
      newlyEarned.push(FRAGMENTS.find(f => f.key === 'garden'));
    }
    // 🌙 유대: 은늑대 첫 제압
    if (!state.fragments.wolf && (state.codex.mobs.silverwolf?.killed || 0) > 0) {
      state.fragments.wolf = true;
      newlyEarned.push(FRAGMENTS.find(f => f.key === 'wolf'));
    }
    // ⭐ 숙련: 발견한 연구 레시피 15종 (자동 언락 포함)
    const discovered = getDiscoveredResearch(state);
    if (!state.fragments.mastery && discovered.size >= 15) {
      state.fragments.mastery = true;
      newlyEarned.push(FRAGMENTS.find(f => f.key === 'mastery'));
    }
    // 👑 전설: 아기 용 첫 조우 (승패 무관)
    if (!state.fragments.dragon && (state.codex.mobs.babydragon?.encounters || 0) > 0) {
      state.fragments.dragon = true;
      newlyEarned.push(FRAGMENTS.find(f => f.key === 'dragon'));
    }

    const allFragments = FRAGMENTS.every(f => state.fragments[f.key]);
    const letterJustUnlocked = allFragments && !state.letterUnlocked;
    if (letterJustUnlocked) {
      state.letterUnlocked = true;
      // 편지 해금 시 할머니의 홍차 캔 지급 (기념 아이템)
      state.inventory[KEEPSAKE_TEACAN] = (state.inventory[KEEPSAKE_TEACAN] || 0) + 1;
    }
    return { newlyEarned, letterJustUnlocked };
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. 큐
  // ═══════════════════════════════════════════════════════════════

  let queue = [];

  function getOrCreateBakeSession() {
    let s = queue.find(i => i.type === 'bake');
    if (!s) { s = { type: 'bake', items: {} }; queue.push(s); }
    return s;
  }

  function getOrCreateShopSession() {
    let s = queue.find(i => i.type === 'shop');
    if (!s) { s = { type: 'shop', items: {} }; queue.push(s); }
    return s;
  }

  function getOrCreateSellItemSession() {
    let s = queue.find(i => i.type === 'sellItem');
    if (!s) { s = { type: 'sellItem', items: {} }; queue.push(s); }
    return s;
  }

  function getBakeTotal(session) {
    return Object.values(session.items).reduce((a, b) => a + b, 0);
  }

  function bakeSessionAP(session) {
    for (const name of Object.keys(session.items)) {
      const recipe = RECIPES.find(r => r.name === name);
      if (recipe?.ap === 3) return 3;
      // 연구 발견 빵 = 3
      if (RESEARCH_RECIPES.find(r => r.name === name)) return 3;
    }
    return 2;
  }

  function addBake(recipeName) {
    const session = getOrCreateBakeSession();
    if (getBakeTotal(session) >= BAKE_SESSION_MAX) return false;
    session.items[recipeName] = (session.items[recipeName] || 0) + 1;
    return true;
  }

  function addShop(material)  { getOrCreateShopSession().items[material] = (getOrCreateShopSession().items[material] || 0) + 1; }
  function addSellItem(name)  { getOrCreateSellItemSession().items[name] = (getOrCreateSellItemSession().items[name] || 0) + 1; }
  function addSell()          { if (!queue.find(i => i.type === 'sell')) queue.push({ type: 'sell' }); }
  function addForage()        { queue.push({ type: 'forage' }); }
  function addHunt(mobId)     { queue.push({ type: 'hunt', mobId }); }
  function addPlant(slotIdx, itemId) { queue.push({ type: 'plant', slotIdx, itemId }); }
  function addHarvest(slotIdx) { queue.push({ type: 'harvest', slotIdx }); }
  function addResearch(baseName, specialName) { queue.push({ type: 'research', baseName, specialName }); }
  function addCraft(recipeId) { queue.push({ type: 'craft', recipeId }); }
  function addAcceptQuest(questId) { queue.push({ type: 'acceptQuest', questId }); }
  function addSubmitQuest() { if (!queue.find(i => i.type === 'submitQuest')) queue.push({ type: 'submitQuest' }); }
  function addTravel(travelId) { queue.push({ type: 'travel', travelId }); }
  function addEndDay()        { if (!queue.find(i => i.type === 'endDay')) queue.push({ type: 'endDay' }); }
  function removeQueueItem(idx) { queue.splice(idx, 1); }
  function clearQueue() { queue = []; }

  function queueTotalAP() {
    let sum = 0;
    for (const item of queue) {
      if (item.type === 'bake') sum += bakeSessionAP(item);
      else if (item.type === 'shop') sum += 1;
      else if (item.type === 'forage') sum += 2;
      else if (item.type === 'hunt') sum += 3;
      else if (item.type === 'plant') sum += 2;
      else if (item.type === 'harvest') sum += 1;
      else if (item.type === 'research') sum += 3;
      else if (item.type === 'craft') sum += 2;
      // acceptQuest, submitQuest, endDay = AP 0
    }
    return sum;
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. 판매 롤
  // ═══════════════════════════════════════════════════════════════

  // 이름으로 가격 찾기 (일반 + 연구빵 통합)
  function getBreadPrice(name) {
    const recipe = RECIPES.find(r => r.name === name);
    if (recipe) return recipe.price;
    const research = RESEARCH_RECIPES.find(r => r.name === name);
    if (research) return research.price;
    return RECIPES.find(r => r.freeform)?.price || 100;
  }

  function rollSale(state) {
    const dispItems = Object.entries(state.display).filter(([_, q]) => q > 0);
    if (dispItems.length === 0) return null;
    const repBonus = Math.min(0.25, Math.floor(state.reputation / 10) * 0.05);
    const itemsToSell = {};
    let revenue = 0;
    let totalSold = 0;
    for (const [name, qty] of dispItems) {
      const price = getBreadPrice(name);
      let sold = 0;
      for (let i = 0; i < qty; i++) {
        const chance = Math.min(0.95, 0.6 + Math.random() * 0.3 + repBonus);
        if (Math.random() < chance) sold++;
      }
      if (sold > 0) {
        itemsToSell[name] = sold;
        totalSold += sold;
        revenue += sold * price;
      }
    }
    if (totalSold === 0) return null;
    return { itemsToSell, revenue, repGain: totalSold * 3, totalSold };
  }

  function commitSale(state, sale) {
    for (const [name, qty] of Object.entries(sale.itemsToSell)) {
      state.display[name] -= qty;
      if (state.display[name] <= 0) delete state.display[name];
    }
    state.gold += sale.revenue;
    const oldRep = state.reputation;
    state.reputation += sale.repGain;
    const stagesCrossed = [];
    for (const stage of [20, 40, 60, 80, 100]) {
      if (oldRep < stage && state.reputation >= stage) stagesCrossed.push(stage);
    }
    return stagesCrossed;
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. 큐 실행
  // ═══════════════════════════════════════════════════════════════

  function executeQueue(state) {
    const results = [];

    for (const item of queue) {
      // ─── 제빵 ───
      if (item.type === 'bake') {
        const sessionAP = bakeSessionAP(item);
        if (state.ap < sessionAP) { results.push(`✗ 제빵 실패 (행동력 부족, AP ${sessionAP} 필요)`); continue; }
        const sessionResults = [];
        let totalBaked = 0;
        for (const [recipeName, count] of Object.entries(item.items)) {
          // 일반 or 연구 발견
          const recipe = RECIPES.find(r => r.name === recipeName);
          const research = RESEARCH_RECIPES.find(r => r.name === recipeName);
          if (!recipe && !research) {
            // freeform (사용자 입력 이름)
            const freeform = RECIPES.find(r => r.freeform);
            if (!freeform) continue;
            const displayName = recipeName;
            let possible = count;
            for (let i = 1; i <= count; i++) {
              let ok = true;
              for (const [mat, qty] of Object.entries(freeform.mat)) {
                if ((state.inventory[mat] || 0) < qty * i) { ok = false; break; }
              }
              if (!ok) { possible = i - 1; break; }
            }
            if (possible <= 0) { sessionResults.push(`✗ ${displayName} (재료 부족)`); continue; }
            for (const [mat, qty] of Object.entries(freeform.mat)) {
              state.inventory[mat] -= qty * possible;
              if (state.inventory[mat] <= 0) delete state.inventory[mat];
            }
            state.display[displayName] = (state.display[displayName] || 0) + possible;
            totalBaked += possible;
            sessionResults.push(`✨ ${displayName} ${possible}개`);
            continue;
          }
          const usedRecipe = recipe || research;
          const usedMat = recipe ? recipe.mat : getResearchRecipeMat(research);
          const usedIcon = usedRecipe.icon;
          // 명성 체크 (일반빵만)
          if (recipe && state.reputation < recipe.repReq) {
            sessionResults.push(`✗ ${recipeName} (명성 부족)`); continue;
          }
          let possible = count;
          for (let i = 1; i <= count; i++) {
            let ok = true;
            for (const [mat, qty] of Object.entries(usedMat)) {
              if ((state.inventory[mat] || 0) < qty * i) { ok = false; break; }
            }
            if (!ok) { possible = i - 1; break; }
          }
          if (possible <= 0) { sessionResults.push(`✗ ${recipeName} (재료 부족)`); continue; }
          for (const [mat, qty] of Object.entries(usedMat)) {
            state.inventory[mat] -= qty * possible;
            if (state.inventory[mat] <= 0) delete state.inventory[mat];
          }
          state.display[recipeName] = (state.display[recipeName] || 0) + possible;
          totalBaked += possible;
          sessionResults.push(`${usedIcon} ${recipeName} ${possible}개`);
        }
        state.ap -= sessionAP;
        let lvLine = '';
        if (totalBaked > 0) {
          const skR = addSkillExp(state, 'baking', totalBaked * EXP_PER_ACTION);
          if (skR.leveledUp) lvLine = ` ★ 빵 굽기 Lv.${skR.newLevel} 도달!`;
        }
        results.push(`🥐 제빵 — ${sessionResults.join(', ')} (AP ${sessionAP})${lvLine}`);

      // ─── 연구 ───
      } else if (item.type === 'research') {
        if (state.ap < 3) { results.push(`✗ 연구 실패 (행동력 부족)`); continue; }
        const base = BASE_BREADS.find(b => b.name === item.baseName);
        if (!base) continue;
        if (state.reputation < base.repReq) { results.push(`✗ 연구 실패 (${item.baseName}은 명성 ${base.repReq} 필요)`); continue; }
        const specialQty = SPECIAL_INGR_STANDARD[item.specialName];
        if (!specialQty) continue;
        // 재료 체크
        const fullMat = { ...base.mat, [item.specialName]: specialQty };
        let ok = true;
        for (const [mat, qty] of Object.entries(fullMat)) {
          if ((state.inventory[mat] || 0) < qty) { ok = false; break; }
        }
        if (!ok) { results.push(`✗ 연구 실패 (재료 부족, ${item.baseName} + ${item.specialName})`); continue; }
        // 재료 소모
        for (const [mat, qty] of Object.entries(fullMat)) {
          state.inventory[mat] -= qty;
          if (state.inventory[mat] <= 0) delete state.inventory[mat];
        }
        state.ap -= 3;
        // 매핑 찾기
        const recipe = findResearchRecipe(item.baseName, item.specialName);
        const alreadyDiscovered = recipe && state.researched?.[recipe.id];
        if (recipe) {
          state.researched[recipe.id] = true;
          state.display[recipe.name] = (state.display[recipe.name] || 0) + 1;
          const skR = addSkillExp(state, 'research', EXP_PER_ACTION * 2);
          let lvLine = '';
          if (skR.leveledUp) lvLine = ` ★ 레시피 연구 Lv.${skR.newLevel} 도달!`;
          if (alreadyDiscovered) {
            results.push(`🔬 연구 — ${recipe.icon} ${recipe.name} 1개 완성 (AP 3)${lvLine}`);
          } else {
            results.push(`🌟 새 레시피 발견! ${recipe.icon} ${recipe.name} — ${item.baseName}에 ${item.specialName}이 어울렸어! (AP 3)${lvLine}`);
          }
        } else {
          // 실패 → 베이스빵 나옴
          state.display[item.baseName] = (state.display[item.baseName] || 0) + 1;
          const skR = addSkillExp(state, 'research', EXP_PER_ACTION);
          let lvLine = '';
          if (skR.leveledUp) lvLine = ` ★ 레시피 연구 Lv.${skR.newLevel} 도달!`;
          results.push(`🔬 연구 실패 — ${item.baseName}만 나옴. ${item.specialName}이 어울리지 않았어... (AP 3)${lvLine}`);
        }

      // ─── 공예 ───
      } else if (item.type === 'craft') {
        if (state.ap < 2) { results.push(`✗ 공예 실패 (행동력 부족)`); continue; }
        const recipe = CRAFT_RECIPES.find(r => r.id === item.recipeId);
        if (!recipe) continue;
        let ok = true;
        for (const [mat, qty] of Object.entries(recipe.mat)) {
          if ((state.inventory[mat] || 0) < qty) { ok = false; break; }
        }
        if (!ok) { results.push(`✗ ${recipe.name} — 재료 부족`); continue; }
        for (const [mat, qty] of Object.entries(recipe.mat)) {
          state.inventory[mat] -= qty;
          if (state.inventory[mat] <= 0) delete state.inventory[mat];
        }
        state.inventory[recipe.name] = (state.inventory[recipe.name] || 0) + 1;
        state.ap -= 2;
        const skR = addSkillExp(state, 'crafting', EXP_PER_ACTION);
        let lvLine = '';
        if (skR.leveledUp) lvLine = ` ★ 공예 Lv.${skR.newLevel} 도달!`;
        results.push(`🧿 공예 — ${recipe.icon} ${recipe.name} 1개 완성 (AP 2)${lvLine}`);

      // ─── 의뢰 수락 ───
      } else if (item.type === 'acceptQuest') {
        const quest = QUESTS.find(q => q.id === item.questId);
        if (!quest) continue;
        if (state.activeQuest) { results.push(`✗ 이미 진행 중인 의뢰가 있어`); continue; }
        if (!state.boardQuests.includes(item.questId)) { results.push(`✗ 게시판에 없는 의뢰`); continue; }
        const baseline = quest.type === 'hunt'
          ? (state.codex.mobs[quest.huntTarget]?.killed || 0)
          : 0;
        state.activeQuest = {
          id: quest.id,
          acceptedDay: state.day,
          huntBaseline: baseline,
        };
        state.boardQuests = []; // 나머지 2개 사라짐
        results.push(`📋 의뢰 수락 — ${quest.name} (다른 두 의뢰는 사라짐)`);

      // ─── 의뢰 제출 ───
      } else if (item.type === 'submitQuest') {
        if (!state.activeQuest) { results.push(`✗ 진행 중인 의뢰 없음`); continue; }
        const quest = QUESTS.find(q => q.id === state.activeQuest.id);
        if (!quest) { state.activeQuest = null; continue; }
        if (!isQuestComplete(state, quest)) { results.push(`✗ ${quest.name} — 조건 미충족`); continue; }
        if (quest.type === 'item') {
          consumeForQuest(state, quest.requires);
        }
        state.gold += quest.goldReward;
        const oldRep = state.reputation;
        state.reputation += quest.repReward;
        const stages = [];
        for (const stage of [20, 40, 60, 80, 100]) {
          if (oldRep < stage && state.reputation >= stage) stages.push(stage);
        }
        state.activeQuest = null;
        let line = `📋 의뢰 완수 — ${quest.name} (+${quest.goldReward}G, 명성 +${quest.repReward})`;
        for (const stage of stages) line += ` ★ 명성 ${stage} 돌파!`;
        results.push(line);

      // ─── 여행 (v0.7.3) ───
      } else if (item.type === 'travel') {
        const travel = TRAVELS.find(t => t.id === item.travelId);
        if (!travel) continue;
        if (state.gold < travel.price) { results.push(`✗ 여행 실패 (골드 부족, ${travel.price.toLocaleString()}G 필요)`); continue; }
        state.gold -= travel.price;
        results.push(
          `🎫 여행 — ${travel.icon} ${travel.name} 다녀오기로 결정 (-${travel.price.toLocaleString()}G)\n` +
          `  ※ 서사 유도: 이 여행에 대한 장면을 자유롭게 묘사. 문 앞에 "잠시 쉬어갑니다" 팻말을 걸어두거나, 짐을 챙기거나, 여행지의 풍경/만남을 그려내주세요. 골드 소진은 확정치.`
        );

      // ─── 영업 (원턴제, v0.7.5) ───
      } else if (item.type === 'sell') {
        const sale = rollSale(state);
        if (!sale) { results.push(`☼ 영업 — 진열대가 비어있어 손님을 못 맞았어 (AP 0)`); continue; }
        const stages = commitSale(state, sale);
        const itemStr = Object.entries(sale.itemsToSell).map(([n, q]) => `${n} ${q}개`).join(', ');
        let line = `☼ 영업 — 오늘 판매: ${itemStr}. 매출 +${sale.revenue}G, 명성 +${sale.repGain} (AP 0)`;
        for (const stage of stages) line += ` ★ 명성 ${stage} 돌파!`;
        line += `\n  ※ 위 판매량은 확정치. 유저 서술의 "완판" "더 팔렸다" 등은 서사적 과장으로 처리하고 실제 결과는 유지. 손님 등장·대화·분위기는 자유롭게, 총량만 확정치와 일치. 진열대에 안 팔린 빵은 그대로 남아있으니 원하면 영업을 다시 눌러 이어서 팔 수 있음.`;
        results.push(line);

      // ─── 장보기 ───
      } else if (item.type === 'shop') {
        if (state.ap < 1) { results.push(`✗ 장보기 실패 (행동력 부족)`); continue; }
        let totalCost = 0;
        for (const [name, qty] of Object.entries(item.items)) totalCost += itemPrice(name) * qty;
        if (state.gold < totalCost) { results.push(`✗ 장보기 실패 (골드 부족, 필요 ${totalCost}G)`); continue; }
        state.gold -= totalCost;
        const bought = [];
        for (const [name, qty] of Object.entries(item.items)) {
          state.inventory[name] = (state.inventory[name] || 0) + qty;
          bought.push(`${itemIcon(name)}${name} ${qty}`);
        }
        state.ap -= 1;
        results.push(`🛒 장보기 — ${bought.join(', ')} 구입 (-${totalCost}G, AP 1)`);

      // ─── 판매 ───
      } else if (item.type === 'sellItem') {
        let totalRev = 0;
        const sold = [];
        for (const [name, qty] of Object.entries(item.items)) {
          const price = itemPrice(name);
          const has = state.inventory[name] || 0;
          const actualQty = Math.min(qty, has);
          if (actualQty <= 0) continue;
          state.inventory[name] -= actualQty;
          if (state.inventory[name] <= 0) delete state.inventory[name];
          totalRev += price * actualQty;
          sold.push(`${itemIcon(name)}${name} ${actualQty}`);
        }
        if (sold.length > 0) {
          state.gold += totalRev;
          results.push(`💰 판매 — ${sold.join(', ')} (+${totalRev}G)`);
        }

      // ─── 채집 ───
      } else if (item.type === 'forage') {
        if (state.ap < 2) { results.push(`✗ 채집 실패 (행동력 부족)`); continue; }
        const forLv = state.skills.foraging.lv;
        const available = FORAGE_ITEMS.filter(f => f.unlockLv <= forLv);
        state.ap -= 2;
        if (available.length === 0) { results.push(`✗ 채집 — 아무것도 찾지 못함 (AP 2)`); continue; }
        const totalW = available.reduce((a, f) => a + f.weight, 0);
        let roll = Math.random() * totalW;
        let picked = available[available.length - 1];
        for (const f of available) {
          roll -= f.weight;
          if (roll <= 0) { picked = f; break; }
        }
        state.inventory[picked.name] = (state.inventory[picked.name] || 0) + 1;
        if (!state.codex.forages[picked.id]) state.codex.forages[picked.id] = { count: 0 };
        state.codex.forages[picked.id].count++;
        const isFirst = state.codex.forages[picked.id].count === 1;
        const skR = addSkillExp(state, 'foraging', EXP_PER_ACTION);
        let lvLine = '';
        if (skR.leveledUp) lvLine = ` ★ 채집 Lv.${skR.newLevel} 도달!`;
        const newLine = isFirst ? ' 🌟 도감 신규 발견!' : '';
        results.push(`🌿 채집 — ${picked.icon} ${picked.name} 1개 획득 (AP 2)${newLine}${lvLine}`);

      // ─── 사냥 ───
      } else if (item.type === 'hunt') {
        if (state.ap < 3) { results.push(`✗ 사냥 실패 (행동력 부족)`); continue; }
        const mob = MOBS.find(m => m.id === item.mobId);
        if (!mob) continue;
        const advLv = state.skills.adventure.lv;
        if (advLv < mob.unlockLv) {
          results.push(`✗ ${mob.name} — 모험 Lv ${mob.unlockLv} 필요 (현재 Lv.${advLv})`);
          continue;
        }
        state.ap -= 3;
        let winRate = mob.win + (advLv - mob.unlockLv) * 0.05;
        winRate = Math.min(0.95, Math.max(0.1, winRate));
        const win = Math.random() < winRate;
        if (!state.codex.mobs[mob.id]) state.codex.mobs[mob.id] = { encounters: 0, killed: 0 };
        state.codex.mobs[mob.id].encounters++;
        const isFirst = state.codex.mobs[mob.id].encounters === 1;
        const newLine = isFirst ? ' 🌟 도감 신규 발견!' : '';
        if (win) {
          state.codex.mobs[mob.id].killed++;
          const drops = [];
          const gotDrop = Math.random() < mob.dropRate;
          if (gotDrop && mob.drop) {
            state.inventory[mob.drop] = (state.inventory[mob.drop] || 0) + 1;
            drops.push(`${mob.heart || '✨'} ${mob.drop} 1`);
          }
          state.inventory[mob.junk] = (state.inventory[mob.junk] || 0) + 1;
          drops.push(`${mob.junk} 1`);
          if (mob.seedId && mob.seedDropRate > 0 && Math.random() < mob.seedDropRate) {
            const seed = SEEDS.find(s => s.id === mob.seedId);
            if (seed) {
              state.inventory[seed.name] = (state.inventory[seed.name] || 0) + 1;
              drops.push(`🌰 ${seed.name} 1`);
            }
          }
          const skR = addSkillExp(state, 'adventure', EXP_PER_ACTION);
          let lvLine = '';
          if (skR.leveledUp) lvLine = ` ★ 모험 Lv.${skR.newLevel} 도달!`;
          results.push(`🗡 ${mob.icon} ${mob.name} 제압! (${drops.join(', ')}, AP 3)${newLine}${lvLine}`);
        } else {
          state.injured = true;
          results.push(`✗ ${mob.icon} ${mob.name} — 도전 실패, 부상당함 (다음 하루 시작 AP -2, AP 3)${newLine}`);
        }

      // ─── 심기 ───
      } else if (item.type === 'plant') {
        if (state.ap < 2) { results.push(`✗ 심기 실패 (행동력 부족)`); continue; }
        if (!isGardenUnlocked(state)) { results.push(`✗ 정원 잠금 (채집 Lv 3 필요)`); continue; }
        const maxSlots = getGardenMaxSlots(state.skills.gardening.lv);
        if (item.slotIdx >= maxSlots) { results.push(`✗ 슬롯 잠금 (정원 Lv 필요)`); continue; }
        if (state.garden[item.slotIdx]) { results.push(`✗ 이미 심어져 있음`); continue; }
        const seed = SEEDS.find(x => x.id === item.itemId);
        const animal = ANIMALS.find(x => x.id === item.itemId);
        const target = seed || animal;
        if (!target) continue;
        if ((state.inventory[target.name] || 0) < 1) { results.push(`✗ ${target.name} 없음`); continue; }
        state.inventory[target.name]--;
        if (state.inventory[target.name] <= 0) delete state.inventory[target.name];
        state.garden[item.slotIdx] = {
          type: seed ? 'seed' : 'animal',
          id: item.itemId,
          plantedDay: state.day,
          lastYieldDay: state.day,
          storedYield: 0,
        };
        state.ap -= 2;
        const skR = addSkillExp(state, 'gardening', EXP_PER_ACTION);
        let lvLine = '';
        if (skR.leveledUp) lvLine = ` ★ 정원 Lv.${skR.newLevel} 도달!`;
        results.push(`🌱 심기 — ${target.icon} ${target.name}을(를) 정원에 심음 (AP 2)${lvLine}`);

      // ─── 수확 ───
      } else if (item.type === 'harvest') {
        if (state.ap < 1) { results.push(`✗ 수확 실패 (행동력 부족)`); continue; }
        const slot = state.garden[item.slotIdx];
        if (!slot) { results.push(`✗ 빈 슬롯`); continue; }
        let yields = 0;
        let yieldName = '';
        if (slot.type === 'seed') {
          const seed = SEEDS.find(x => x.id === slot.id);
          if (!seed) continue;
          const daysAgo = state.day - slot.lastYieldDay;
          if (daysAgo < GARDEN_CYCLE_DAYS) { results.push(`✗ 아직 자라는 중 (${GARDEN_CYCLE_DAYS - daysAgo}일 후)`); continue; }
          yieldName = seed.yields;
          yields = getSeedYieldAmount(state.skills.gardening.lv);
          slot.lastYieldDay = state.day;
        } else if (slot.type === 'animal') {
          const animal = ANIMALS.find(x => x.id === slot.id);
          if (!animal) continue;
          if ((slot.storedYield || 0) <= 0) { results.push(`✗ 아직 저장된 게 없음`); continue; }
          yieldName = animal.yields;
          yields = slot.storedYield;
          slot.storedYield = 0;
          slot.lastYieldDay = state.day;
        }
        if (yields > 0) {
          state.inventory[yieldName] = (state.inventory[yieldName] || 0) + yields;
          state.ap -= 1;
          const skR = addSkillExp(state, 'gardening', EXP_PER_ACTION);
          let lvLine = '';
          if (skR.leveledUp) lvLine = ` ★ 정원 Lv.${skR.newLevel} 도달!`;
          results.push(`🌱 수확 — ${itemIcon(yieldName)} ${yieldName} ${yields}개 (AP 1)${lvLine}`);
        }

      // ─── 하루 마감 ───
      } else if (item.type === 'endDay') {
        state.day += 1;
        for (const slot of state.garden) {
          if (slot?.type === 'animal') {
            const daysSince = state.day - slot.lastYieldDay;
            const shouldHave = Math.floor(daysSince / GARDEN_CYCLE_DAYS);
            slot.storedYield = Math.min(ANIMAL_MAX_STORE, shouldHave);
          }
        }
        if (state.injured) {
          state.ap = Math.max(0, state.apMax - 2);
          state.injured = false;
          results.push(`☾ 하루 마감 — DAY ${state.day} 시작. 부상 회복 중, AP ${state.ap}/${state.apMax}로 시작`);
        } else {
          state.ap = state.apMax;
          results.push(`☾ 하루 마감 — DAY ${state.day} 시작. 행동력 ${state.apMax} 회복`);
        }
        // v0.7 게시판 갱신 (3일 주기)
        if (state.reputation >= BOARD_UNLOCK_REP) {
          const needRefresh =
            state.boardRefreshDay === 0 ||
            (state.day - state.boardRefreshDay) >= BOARD_REFRESH_DAYS;
          if (needRefresh) {
            state.boardQuests = rollNewBoardQuests();
            state.boardRefreshDay = state.day;
            results.push(`📋 게시판 — 새로운 의뢰 3건 등장!`);
          }
        }
      }
    }

    if (results.length > 0) {
      state.log.unshift({ day: state.day, items: results });
      state.log = state.log.slice(0, 20);
    }
    // v0.7.1 조각/편지 체크
    const frag = checkFragments(state);
    for (const f of frag.newlyEarned) {
      const line = `🧩 ${f.icon} ${f.name} 획득! — ${f.desc.replace(/\s*\([^)]+\)$/, '')}.`;
      results.push(line);
      if (state.log[0]?.day === state.day) state.log[0].items.push(line);
      else state.log.unshift({ day: state.day, items: [line] });
    }
    if (frag.letterJustUnlocked) {
      const line = `💌 할머니의 편지 도착! — 다섯 조각이 모두 모였어. 🧩 조각 탭에서 확인해봐. 🫖 할머니의 홍차 캔도 함께 발견했어.`;
      results.push(line);
      if (state.log[0]?.day === state.day) state.log[0].items.push(line);
      else state.log.unshift({ day: state.day, items: [line] });
    }
    return results;
  }

  // ═══════════════════════════════════════════════════════════════
  // 10. LLM prepend
  // ═══════════════════════════════════════════════════════════════

  function formatStatusBlock(state) {
    const skillLines = SKILLS.map(s => `${s.label}: Lv.${state.skills[s.key].lv}`).join(', ');
    const lines = [
      `[현재 상태] DAY ${state.day}, AP ${state.ap}/${state.apMax}, 골드 ${state.gold}G, 명성 ${state.reputation}${state.injured ? ' (부상)' : ''}`,
      `[스킬] ${skillLines}`,
    ];
    const dispList = Object.entries(state.display).filter(([_, q]) => q > 0);
    if (dispList.length > 0) {
      lines.push(`[진열대] ${dispList.map(([n, q]) => `${n} ${q}`).join(', ')}`);
    }
    if (state.activeQuest) {
      const q = QUESTS.find(x => x.id === state.activeQuest.id);
      if (q) lines.push(`[진행 중 의뢰] ${q.name} — ${q.desc}`);
    }
    return lines.join('\n');
  }

  function formatActionLog(state, results) {
    const blocks = [];
    if (results.length > 0) blocks.push('[행동 결과]\n' + results.join('\n'));
    blocks.push(formatStatusBlock(state));
    return blocks.join('\n\n');
  }

  // ═══════════════════════════════════════════════════════════════
  // 11. beforeRequest
  // ═══════════════════════════════════════════════════════════════

  risuai.addRisuReplacer('beforeRequest', async (messages, type) => {
    try {
      // v0.7.6 - 세이브 없고 큐도 없으면 아무것도 안 함 (다른 캐릭터 챗 보호)
      const hasSave = await hasSaveData();
      if (!hasSave && queue.length === 0) {
        return messages;
      }
      const state = await loadState();
      let results = [];
      if (queue.length > 0) {
        // 스냅샷 저장 (undo용) - previousSnapshot 자체는 제외
        const snapshot = structuredClone({ ...state, previousSnapshot: null });
        results = executeQueue(state);
        state.previousSnapshot = snapshot;
        clearQueue();
      }
      await saveState(state);
      const log = formatActionLog(state, results);
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          messages[i].content = log + '\n\n' + (messages[i].content || '');
          break;
        }
      }
      if (document.getElementById('cb-root')) {
        currentState = state;
        renderUI();
      }
    } catch (e) {
      console.error('[cozy_bakery] beforeRequest 실패', e);
    }
    return messages;
  });

  // ═══════════════════════════════════════════════════════════════
  // 12. UI 상태
  // ═══════════════════════════════════════════════════════════════

  let currentTab = 'status';
  let activitySub = 'main';   // main / bake / sell / out / shop / adv / forage / hunt / garden / plant / research / researchSpecial
  let codexSub = 'mobs';       // mobs / forages / recipes
  let shopSub = 'buy';
  let bakeFilter = 'all';      // all / basic / forage / magic / favorite
  let plantTargetSlot = 0;
  let researchBaseName = null; // 연구 UI: 선택된 베이스빵
  let currentState = null;

  // ═══════════════════════════════════════════════════════════════
  // 13. CSS
  // ═══════════════════════════════════════════════════════════════

  const CSS = `
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Pretendard',-apple-system,'Apple SD Gothic Neo',sans-serif;
         background:transparent;color:#2D3A2F;overflow:hidden;}
    #cb-backdrop{position:fixed;inset:0;background:rgba(30,58,46,0.15);backdrop-filter:blur(2px);}
    #cb-root{position:fixed;bottom:20px;right:20px;width:440px;max-height:88vh;
             background:#FBFAF5;border:3px solid #1E3A2E;border-radius:8px;
             box-shadow:4px 4px 0 #1E3A2E, 0 8px 24px rgba(30,58,46,0.2);
             overflow:hidden;display:flex;flex-direction:column;}
    @media (max-width:600px){
      #cb-root{width:92vw;right:4vw;bottom:70px;max-height:80vh;}
    }

    .cb-header{background:linear-gradient(180deg,#A8C9B4 0%,#7BA98F 100%);padding:8px 12px;
               display:flex;justify-content:space-between;align-items:center;
               border-bottom:3px solid #1E3A2E;cursor:move;position:relative;}
    .cb-header::before{content:'';position:absolute;top:50%;left:12px;transform:translateY(-50%);
                       width:8px;height:8px;background:#FBFAF5;border:2px solid #1E3A2E;border-radius:50%;}
    .cb-title{color:#1E3A2E;font-size:13px;font-weight:700;letter-spacing:0.5px;margin-left:16px;}
    .cb-hbtns{display:flex;gap:4px;}
    .cb-hbtn{width:22px;height:22px;background:#FBFAF5;border:2px solid #1E3A2E;border-radius:3px;
             cursor:pointer;font-size:11px;color:#1E3A2E;font-family:inherit;font-weight:bold;
             display:flex;align-items:center;justify-content:center;}
    .cb-hbtn:hover{background:#E8A4BC;color:#FBFAF5;}

    .cb-statbar{background:#E0EDE4;border-bottom:2px solid #1E3A2E;padding:8px 12px;}
    .cb-statbar-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
    .cb-statbar-day{font-size:12px;color:#1E3A2E;font-weight:700;}
    .cb-statbar-day.injured::after{content:' 🩹';}
    .cb-statbar-stats{display:flex;gap:6px;}
    .cb-statbar-stat{background:#FBFAF5;border:2px solid #1E3A2E;padding:2px 7px;border-radius:3px;
                     font-size:11px;color:#2D3A2F;font-weight:500;}
    .cb-statbar-ap{display:flex;align-items:center;gap:8px;}
    .cb-statbar-ap-label{font-size:11px;color:#1E3A2E;font-weight:600;}
    .cb-ap-cells{display:flex;gap:2px;flex:1;}
    .cb-ap-cell{flex:1;height:12px;border:2px solid #1E3A2E;border-radius:2px;background:#FBFAF5;}
    .cb-ap-cell.filled{background:linear-gradient(180deg,#E8A4BC 0%,#C97D9A 100%);}
    .cb-ap-cell.spent{background:#E8D7C4;}

    .cb-main{display:flex;flex:1;min-height:0;}
    .cb-body{flex:1;background:#FBFAF5;padding:12px;overflow-y:auto;order:1;}
    .cb-body::-webkit-scrollbar{width:6px;}
    .cb-body::-webkit-scrollbar-track{background:#F5F1E8;}
    .cb-body::-webkit-scrollbar-thumb{background:#7BA98F;border-radius:3px;}

    .cb-sidetabs{width:52px;background:#F5F1E8;border-left:2px solid #1E3A2E;
                 display:flex;flex-direction:column;padding:6px 0;gap:4px;order:2;flex-shrink:0;}
    .cb-sidetab{margin-left:4px;padding:8px 0;background:#E8D7C4;border:2px solid #1E3A2E;
                border-right:none;border-radius:4px 0 0 4px;cursor:pointer;text-align:center;
                transition:transform 0.1s;}
    .cb-sidetab:hover:not(.active){background:#F5DDE5;transform:translateX(-2px);}
    .cb-sidetab.active{background:#FBFAF5;margin-left:0;border-right:2px solid #FBFAF5;
                       transform:translateX(-2px);box-shadow:-2px 2px 0 #1E3A2E;}
    .cb-sidetab-icon{font-size:16px;line-height:1;}
    .cb-sidetab-label{font-size:9px;color:#6B7A6E;margin-top:2px;font-weight:500;}
    .cb-sidetab.active .cb-sidetab-label{color:#1E3A2E;font-weight:700;}

    .cb-back{display:flex;align-items:center;gap:5px;background:#F5F1E8;border:2px solid #1E3A2E;
             border-radius:4px;padding:5px 12px;font-size:11px;color:#2D3A2F;font-family:inherit;
             font-weight:600;cursor:pointer;margin-bottom:10px;}
    .cb-back:hover{background:#F5DDE5;}

    .cb-sec-title{text-align:center;color:#1E3A2E;font-size:11px;letter-spacing:2px;
                  margin:6px 0 8px 0;padding:4px 0;border-top:1px dashed #3D5849;
                  border-bottom:1px dashed #3D5849;font-weight:600;}
    .cb-sec-title::before{content:'🌿 ';}
    .cb-sec-title::after{content:' 🌿';}

    .cb-preview{background:#F5DDE5;border:2px solid #C97D9A;border-radius:6px;
                padding:8px 10px;margin-bottom:12px;}
    .cb-preview-label{font-size:10px;color:#C97D9A;margin-bottom:6px;letter-spacing:1px;
                      text-align:center;font-weight:600;}
    .cb-preview-empty{font-size:10px;color:#999;text-align:center;font-style:italic;padding:3px;}
    .cb-preview-list{display:flex;flex-direction:column;gap:5px;}
    .cb-qitem{background:#FBFAF5;border:2px solid #1E3A2E;border-radius:4px;padding:6px 8px;
              font-size:11px;color:#2D3A2F;display:flex;justify-content:space-between;
              align-items:flex-start;gap:6px;}
    .cb-qitem-content{flex:1;line-height:1.5;}
    .cb-qitem-title{font-weight:600;color:#1E3A2E;}
    .cb-qitem-detail{font-size:10px;color:#6B7A6E;margin-top:2px;}
    .cb-qitem-x{background:none;border:none;color:#C97D9A;font-size:12px;cursor:pointer;
                font-family:inherit;padding:0;flex-shrink:0;font-weight:bold;}
    .cb-qitem-x:hover{color:#8B3A5A;}
    .cb-preview-ap{font-size:10px;color:#1E3A2E;text-align:right;margin-top:6px;font-weight:600;}
    .cb-preview-ap.warn{color:#C62828;}

    .cb-card{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:6px;
             padding:10px;margin-bottom:10px;}
    .cb-skill-row{display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px dashed #B8967B;}
    .cb-skill-row:last-child{border-bottom:none;}
    .cb-skill-icbox{width:32px;height:32px;background:#E0EDE4;border:2px solid #1E3A2E;
                    border-radius:4px;display:flex;align-items:center;justify-content:center;
                    font-size:18px;flex-shrink:0;}
    .cb-skill-info{flex:1;}
    .cb-skill-name{font-size:11px;color:#2D3A2F;margin-bottom:3px;display:flex;
                   justify-content:space-between;align-items:center;font-weight:500;}
    .cb-skill-lv{font-size:11px;color:#1E3A2E;font-weight:700;}
    .cb-skill-bar{height:6px;background:#E8D7C4;border:1px solid #1E3A2E;border-radius:2px;overflow:hidden;}
    .cb-skill-bar-fill{height:100%;background:linear-gradient(90deg,#E8A4BC 0%,#C97D9A 100%);}

    .cb-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;}
    .cb-slot{aspect-ratio:1;background:#FBFAF5;border:2px solid #1E3A2E;border-radius:4px;
             display:flex;align-items:center;justify-content:center;position:relative;
             font-size:20px;cursor:pointer;}
    .cb-slot:hover:not(.empty):not(.locked){background:#F5DDE5;}
    .cb-slot.empty{background:repeating-linear-gradient(45deg,#E8D7C4,#E8D7C4 3px,#FBFAF5 3px,#FBFAF5 6px);
                   cursor:default;}
    .cb-slot.locked{opacity:0.4;cursor:not-allowed;}
    .cb-slot-count{position:absolute;bottom:-2px;right:1px;background:#1E3A2E;color:#FBFAF5;
                   font-size:9px;padding:1px 4px;border-radius:3px;line-height:1;font-weight:600;}

    /* 인벤 아이템 이름 팝업 (v0.7.5) */
    .cb-item-tap{cursor:pointer;}
    .cb-item-tap:active{transform:scale(0.92);}
    .cb-inv-hint{font-size:10px;color:#8A9A8E;text-align:center;margin:-4px 0 8px;font-style:italic;}
    .cb-item-tooltip{position:fixed;left:50%;bottom:80px;transform:translateX(-50%) translateY(10px);
                     background:#1E3A2E;color:#FBFAF5;padding:8px 16px;border-radius:6px;
                     font-size:12px;font-weight:600;white-space:nowrap;z-index:9999;
                     box-shadow:2px 2px 0 rgba(0,0,0,0.2);opacity:0;pointer-events:none;
                     transition:opacity 0.15s, transform 0.15s;border:2px solid #FBFAF5;}
    .cb-item-tooltip.show{opacity:1;transform:translateX(-50%) translateY(0);}

    .cb-teacan-note{margin-top:12px;padding:8px 10px;background:#F5F1E8;border:2px dashed #C97D9A;
                    border-radius:5px;font-size:11px;color:#8C6247;text-align:center;}
    .cb-teacan-note b{color:#C97D9A;}

    /* 즐겨찾기 6칸 */
    .cb-fav-strip{background:#F5DDE5;border:2px solid #C97D9A;border-radius:6px;
                  padding:6px;margin-bottom:10px;}
    .cb-fav-label{font-size:10px;color:#C97D9A;text-align:center;margin-bottom:5px;
                  letter-spacing:1px;font-weight:600;}
    .cb-fav-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;}
    .cb-fav-slot{aspect-ratio:1;background:#FBFAF5;border:2px solid #C97D9A;border-radius:4px;
                 display:flex;align-items:center;justify-content:center;font-size:18px;
                 cursor:pointer;position:relative;}
    .cb-fav-slot:hover:not(.empty){background:#F5DDE5;}
    .cb-fav-slot.empty{background:repeating-linear-gradient(45deg,#F5DDE5,#F5DDE5 3px,#FBFAF5 3px,#FBFAF5 6px);
                       cursor:default;color:#C97D9A;font-size:11px;}

    .cb-act-list{display:flex;flex-direction:column;gap:8px;}
    .cb-act-row{display:flex;align-items:center;gap:10px;background:#F5F1E8;
                border:2px solid #1E3A2E;border-radius:6px;padding:8px;cursor:pointer;
                transition:transform 0.1s;}
    .cb-act-row:hover:not(.locked){background:#F5DDE5;transform:translateX(2px);}
    .cb-act-row.locked{opacity:0.5;cursor:not-allowed;}
    .cb-act-icbox{width:42px;height:42px;background:#E0EDE4;border:2px solid #1E3A2E;border-radius:5px;
                  display:flex;align-items:center;justify-content:center;font-size:22px;
                  flex-shrink:0;position:relative;}
    .cb-act-row.locked .cb-act-icbox{background:#E8D7C4;}
    .cb-act-row.locked .cb-act-icbox::after{content:'🔒';position:absolute;bottom:1px;right:1px;
                                             font-size:10px;background:#FBFAF5;padding:0 2px;border-radius:2px;}
    .cb-act-info{flex:1;}
    .cb-act-name{font-size:13px;color:#2D3A2F;margin-bottom:3px;letter-spacing:0.5px;font-weight:600;}
    .cb-act-meta{font-size:10px;color:#6B7A6E;display:flex;align-items:center;gap:3px;}
    .cb-act-meta-line{flex:1;border-top:1px dashed #B8967B;margin:0 4px;}
    .cb-act-arrow{width:26px;height:26px;background:#FBFAF5;border:2px solid #1E3A2E;border-radius:4px;
                  display:flex;align-items:center;justify-content:center;font-size:12px;
                  color:#1E3A2E;flex-shrink:0;font-weight:bold;}
    .cb-act-row:hover:not(.locked) .cb-act-arrow{background:#E8A4BC;color:#FBFAF5;}

    .cb-rep-stage{font-size:10px;color:#1E3A2E;text-align:center;background:#E0EDE4;
                  border:2px solid #1E3A2E;border-radius:4px;padding:4px;margin:10px 0 6px 0;
                  letter-spacing:2px;font-weight:600;}
    .cb-rep-stage.locked{background:#E8D7C4;color:#B8967B;}
    .cb-rep-stage.magic{background:linear-gradient(90deg,#E0EDE4,#F5DDE5);}
    .cb-rep-stage.forage{background:linear-gradient(90deg,#E0EDE4,#DCEDC8);}
    .cb-bake-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-bottom:8px;}
    .cb-bake-card{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:5px;padding:8px 5px;
                  cursor:pointer;text-align:center;transition:transform 0.1s;position:relative;}
    .cb-bake-card:hover:not(.locked){background:#F5DDE5;transform:translateY(-2px);}
    .cb-bake-card.locked{opacity:0.45;cursor:not-allowed;}
    .cb-bake-card.locked::after{content:'🔒';position:absolute;top:3px;right:5px;font-size:11px;}
    .cb-bake-card.magic{border-color:#C97D9A;background:#FDF1F5;}
    .cb-bake-card.forage{border-color:#7BA98F;background:#F3F8EE;}
    .cb-bake-fav{position:absolute;top:3px;left:5px;font-size:14px;color:#C97D9A;cursor:pointer;
                 background:none;border:none;padding:0;line-height:1;}
    .cb-bake-fav:hover{transform:scale(1.2);}
    .cb-bake-ic{font-size:24px;margin-bottom:4px;}
    .cb-bake-nm{font-size:11px;color:#2D3A2F;margin-bottom:3px;font-weight:600;}
    .cb-bake-cost{font-size:9px;color:#6B7A6E;line-height:1.4;}
    .cb-bake-price{font-size:10px;color:#C97D9A;margin-top:3px;font-weight:600;}

    .cb-shop-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-bottom:8px;}
    .cb-shop-card{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:5px;padding:10px 8px;
                  cursor:pointer;text-align:center;transition:transform 0.1s;
                  display:flex;align-items:center;justify-content:space-between;gap:10px;}
    .cb-shop-card:hover{background:#F5DDE5;transform:translateY(-2px);}
    .cb-shop-card-icon{font-size:26px;}
    .cb-shop-card-info{flex:1;text-align:left;}
    .cb-shop-card-nm{font-size:12px;color:#2D3A2F;margin-bottom:2px;font-weight:600;}
    .cb-shop-card-price{font-size:11px;color:#C97D9A;font-weight:600;}
    .cb-shop-card-owned{font-size:10px;color:#6B7A6E;margin-top:2px;}

    .cb-subtabs{display:flex;gap:4px;margin-bottom:10px;}
    .cb-subtab{flex:1;padding:6px;background:#F5F1E8;border:2px solid #1E3A2E;border-radius:4px;
               cursor:pointer;text-align:center;font-size:11px;color:#6B7A6E;font-weight:500;}
    .cb-subtab.active{background:#E0EDE4;color:#1E3A2E;font-weight:700;}
    .cb-subtab:hover:not(.active){background:#F5DDE5;}

    /* 제빵 필터 */
    .cb-filter-row{display:flex;gap:4px;margin-bottom:10px;overflow-x:auto;padding-bottom:2px;}
    .cb-filter-chip{padding:5px 10px;background:#F5F1E8;border:2px solid #1E3A2E;border-radius:12px;
                    cursor:pointer;font-size:10px;color:#6B7A6E;font-weight:600;white-space:nowrap;flex-shrink:0;}
    .cb-filter-chip.active{background:#1E3A2E;color:#FBFAF5;}
    .cb-filter-chip:hover:not(.active){background:#F5DDE5;}

    .cb-info-box{background:#E0EDE4;border:2px dashed #1E3A2E;border-radius:5px;padding:8px;
                 font-size:10px;color:#2D3A2F;text-align:center;line-height:1.6;margin-bottom:8px;}

    .cb-sell-opt{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:6px;padding:12px;
                 cursor:pointer;text-align:center;transition:transform 0.1s;margin-bottom:8px;}
    .cb-sell-opt:hover{background:#F5DDE5;transform:translateX(2px);}
    .cb-sell-opt.end{background:#E0EDE4;}
    .cb-sell-opt.end:hover{background:#A8C9B4;}
    .cb-sell-opt.active{background:linear-gradient(90deg,#F5DDE5,#FDF1F5);}
    .cb-sell-opt-icon{font-size:24px;margin-bottom:4px;}
    .cb-sell-opt-nm{font-size:12px;color:#1E3A2E;font-weight:600;letter-spacing:1px;}
    .cb-sell-opt-meta{font-size:10px;color:#6B7A6E;margin-top:3px;}

    .cb-mob-card{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:6px;
                 padding:8px;margin-bottom:6px;display:flex;align-items:center;gap:10px;
                 cursor:pointer;transition:transform 0.1s;}
    .cb-mob-card:hover:not(.locked){background:#F5DDE5;transform:translateX(2px);}
    .cb-mob-card.locked{opacity:0.5;cursor:not-allowed;}
    .cb-mob-icon{width:42px;height:42px;background:#FBFAF5;border:2px solid #1E3A2E;
                 border-radius:5px;display:flex;align-items:center;justify-content:center;
                 font-size:22px;flex-shrink:0;}
    .cb-mob-info{flex:1;}
    .cb-mob-name{font-size:12px;color:#2D3A2F;font-weight:600;margin-bottom:2px;}
    .cb-mob-meta{font-size:10px;color:#6B7A6E;}
    .cb-mob-win{background:#FBFAF5;border:2px solid #1E3A2E;border-radius:4px;padding:3px 8px;
                font-size:11px;color:#1E3A2E;font-weight:700;flex-shrink:0;}

    .cb-codex-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;}
    .cb-codex-card{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:6px;
                   padding:8px;text-align:center;position:relative;}
    .cb-codex-card.unknown{background:#E8D7C4;color:#B8967B;}
    .cb-codex-icon{font-size:28px;margin-bottom:4px;}
    .cb-codex-icon.silhouette{filter:brightness(0) opacity(0.3);}
    .cb-codex-name{font-size:11px;color:#2D3A2F;font-weight:600;margin-bottom:3px;}
    .cb-codex-info{font-size:9px;color:#6B7A6E;line-height:1.4;}
    .cb-codex-progress{font-size:11px;color:#1E3A2E;text-align:center;font-weight:700;
                       background:#E0EDE4;border:2px solid #1E3A2E;border-radius:4px;
                       padding:5px;margin-bottom:10px;}

    /* 레시피 도감 */
    .cb-recipe-group{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:6px;
                     padding:8px;margin-bottom:8px;}
    .cb-recipe-group-header{display:flex;align-items:center;gap:6px;margin-bottom:6px;
                            padding-bottom:5px;border-bottom:1px dashed #B8967B;}
    .cb-recipe-group-icon{font-size:18px;}
    .cb-recipe-group-name{font-size:12px;color:#1E3A2E;font-weight:700;flex:1;}
    .cb-recipe-group-count{font-size:11px;color:#7BA98F;font-weight:700;
                           background:#FBFAF5;border:2px solid #7BA98F;border-radius:10px;padding:1px 8px;}
    .cb-recipe-list{display:flex;flex-direction:column;gap:3px;}
    .cb-recipe-row{display:flex;align-items:center;gap:6px;padding:4px 6px;font-size:11px;
                   background:#FBFAF5;border-radius:3px;}
    .cb-recipe-row.locked{opacity:0.55;color:#B8967B;}
    .cb-recipe-row.discovered{color:#1E3A2E;font-weight:500;}
    .cb-recipe-row-icon{font-size:14px;flex-shrink:0;}
    .cb-recipe-row-nm{flex:1;font-size:11px;}
    .cb-recipe-row-base{font-size:9px;color:#6B7A6E;}

    /* 정원 슬롯 */
    .cb-garden-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px;}
    .cb-garden-slot{aspect-ratio:1;background:#F5F1E8;border:2px solid #1E3A2E;border-radius:6px;
                    display:flex;flex-direction:column;align-items:center;justify-content:center;
                    cursor:pointer;transition:transform 0.1s;padding:4px;text-align:center;}
    .cb-garden-slot:hover:not(.locked):not(.growing){background:#F5DDE5;transform:translateY(-2px);}
    .cb-garden-slot.locked{opacity:0.4;cursor:not-allowed;background:#E8D7C4;}
    .cb-garden-slot.ready{background:#DCEDC8;border-color:#7BA98F;}
    .cb-garden-slot.growing{cursor:default;}
    .cb-garden-icon{font-size:26px;margin-bottom:2px;}
    .cb-garden-name{font-size:9px;color:#2D3A2F;font-weight:600;}
    .cb-garden-status{font-size:8px;color:#6B7A6E;margin-top:2px;}
    .cb-garden-status.ready{color:#7BA98F;font-weight:700;}
    .cb-garden-lock{font-size:20px;}

    /* 심기 카드 */
    .cb-plant-card{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:5px;
                   padding:10px 8px;cursor:pointer;transition:transform 0.1s;margin-bottom:6px;
                   display:flex;align-items:center;gap:10px;}
    .cb-plant-card:hover{background:#F5DDE5;transform:translateX(2px);}
    .cb-plant-icon{font-size:26px;flex-shrink:0;}
    .cb-plant-info{flex:1;}
    .cb-plant-name{font-size:12px;color:#2D3A2F;font-weight:600;}
    .cb-plant-desc{font-size:10px;color:#6B7A6E;margin-top:2px;}
    .cb-plant-owned{font-size:10px;color:#7BA98F;font-weight:600;margin-top:2px;}

    /* 연구 UI */
    .cb-research-card{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:5px;
                      padding:10px 8px;cursor:pointer;transition:transform 0.1s;margin-bottom:6px;
                      display:flex;align-items:center;gap:10px;}
    .cb-research-card:hover:not(.locked){background:#F5DDE5;transform:translateX(2px);}
    .cb-research-card.locked{opacity:0.5;cursor:not-allowed;}
    .cb-research-icon{font-size:26px;flex-shrink:0;}
    .cb-research-info{flex:1;}
    .cb-research-name{font-size:12px;color:#2D3A2F;font-weight:600;}
    .cb-research-mat{font-size:10px;color:#6B7A6E;margin-top:2px;}
    .cb-research-note{font-size:10px;color:#C97D9A;font-weight:600;margin-top:2px;}

    /* 공예 (v0.7) */
    .cb-craft-card{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:5px;
                   padding:10px 8px;cursor:pointer;transition:transform 0.1s;margin-bottom:6px;
                   display:flex;align-items:center;gap:10px;}
    .cb-craft-card:hover:not(.locked){background:#F5DDE5;transform:translateX(2px);}
    .cb-craft-card.locked{opacity:0.5;cursor:not-allowed;}
    .cb-craft-card.special{background:#FDF1F5;border-color:#C97D9A;}
    .cb-craft-card.special:hover:not(.locked){background:#F5DDE5;}
    .cb-craft-icon{font-size:26px;flex-shrink:0;}
    .cb-craft-info{flex:1;}
    .cb-craft-name{font-size:12px;color:#2D3A2F;font-weight:600;}
    .cb-craft-mat{font-size:10px;color:#6B7A6E;margin-top:2px;}
    .cb-craft-price{font-size:11px;color:#C97D9A;font-weight:600;margin-top:2px;}

    /* 조각/편지 (v0.7.1) */
    .cb-frag-list{display:flex;flex-direction:column;gap:6px;}
    .cb-frag-card{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:6px;
                  padding:8px 10px;display:flex;align-items:center;gap:10px;opacity:0.55;}
    .cb-frag-card.got{opacity:1;background:#FDF1F5;border-color:#C97D9A;}
    .cb-frag-icon{width:34px;height:34px;background:#FBFAF5;border:2px solid #1E3A2E;
                  border-radius:5px;display:flex;align-items:center;justify-content:center;
                  font-size:20px;flex-shrink:0;}
    .cb-frag-info{flex:1;}
    .cb-frag-name{font-size:12px;color:#2D3A2F;font-weight:700;}
    .cb-frag-desc{font-size:10px;color:#6B7A6E;margin-top:2px;}

    .cb-letter-locked{background:#E8D7C4;border:2px dashed #B8967B;border-radius:6px;
                      padding:16px;text-align:center;}
    .cb-letter-locked-icon{font-size:32px;margin-bottom:6px;opacity:0.5;}
    .cb-letter-locked-title{font-size:13px;color:#6B7A6E;font-weight:700;margin-bottom:3px;letter-spacing:1px;}
    .cb-letter-locked-desc{font-size:10px;color:#6B7A6E;}

    .cb-letter-envelope{background:linear-gradient(180deg,#FDF1F5 0%,#F5DDE5 100%);
                        border:2px solid #C97D9A;border-radius:6px;padding:16px;
                        text-align:center;cursor:pointer;transition:transform 0.15s;
                        box-shadow:2px 2px 0 #C97D9A;}
    .cb-letter-envelope:hover{transform:translateY(-2px);box-shadow:2px 4px 0 #C97D9A;}
    .cb-letter-envelope-icon{font-size:34px;margin-bottom:6px;}
    .cb-letter-envelope-title{font-size:14px;color:#1E3A2E;font-weight:700;margin-bottom:4px;letter-spacing:2px;}
    .cb-letter-envelope-desc{font-size:11px;color:#C97D9A;font-weight:600;}

    .cb-letter-open{background:#FFFDF7;border:2px solid #C97D9A;border-radius:6px;
                    padding:14px 16px;position:relative;
                    box-shadow:2px 2px 0 #C97D9A;}
    .cb-letter-header{display:flex;justify-content:space-between;align-items:center;
                      padding-bottom:8px;margin-bottom:10px;
                      border-bottom:1px dashed #C97D9A;font-size:12px;color:#1E3A2E;font-weight:700;letter-spacing:1px;}
    .cb-letter-close{background:#FBFAF5;border:2px solid #C97D9A;border-radius:3px;
                     padding:3px 8px;font-size:10px;color:#C97D9A;font-family:inherit;
                     font-weight:600;cursor:pointer;}
    .cb-letter-close:hover{background:#C97D9A;color:#FBFAF5;}
    .cb-letter-body{font-size:11.5px;color:#3D3A32;line-height:1.9;letter-spacing:0.3px;
                    font-family:'Nanum Myeongjo','Times New Roman',serif;
                    white-space:normal;padding:4px 2px;}

    /* 여행 (v0.7.3) */
    .cb-travel-card{background:linear-gradient(180deg,#FFFDF7 0%,#F5F1E8 100%);
                    border:2px solid #1E3A2E;border-radius:6px;padding:12px;margin-bottom:8px;
                    cursor:pointer;transition:transform 0.1s;display:flex;align-items:center;gap:12px;}
    .cb-travel-card:hover:not(.locked){background:linear-gradient(180deg,#FDF1F5 0%,#F5DDE5 100%);transform:translateY(-2px);}
    .cb-travel-card.locked{opacity:0.5;cursor:not-allowed;}
    .cb-travel-icon{font-size:34px;flex-shrink:0;}
    .cb-travel-info{flex:1;}
    .cb-travel-name{font-size:13px;color:#1E3A2E;font-weight:700;margin-bottom:3px;}
    .cb-travel-desc{font-size:10px;color:#6B7A6E;margin-bottom:5px;line-height:1.5;}
    .cb-travel-price{font-size:12px;color:#C97D9A;font-weight:700;}

    /* 의뢰 게시판 (v0.7) */
    .cb-quest-card{background:#F5F1E8;border:2px solid #1E3A2E;border-radius:6px;
                   padding:10px;margin-bottom:8px;cursor:pointer;transition:transform 0.1s;}
    .cb-quest-card:hover{background:#F5DDE5;transform:translateY(-2px);}
    .cb-quest-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;}
    .cb-quest-name{font-size:12px;color:#1E3A2E;font-weight:700;flex:1;}
    .cb-quest-cat{font-size:9px;color:#7BA98F;background:#E0EDE4;padding:2px 6px;border-radius:8px;font-weight:600;}
    .cb-quest-desc{font-size:11px;color:#2D3A2F;margin-bottom:5px;padding:5px 6px;background:#FBFAF5;border-radius:3px;}
    .cb-quest-reward{font-size:10px;color:#C97D9A;font-weight:600;text-align:right;}
    .cb-quest-active{background:#FDF1F5;border:2px solid #C97D9A;border-radius:6px;
                     padding:12px;margin-bottom:10px;}
    .cb-quest-active-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
    .cb-quest-active-name{font-size:13px;color:#1E3A2E;font-weight:700;}
    .cb-quest-active-cat{font-size:9px;color:#C97D9A;background:#FBFAF5;padding:2px 7px;border-radius:8px;font-weight:600;}
    .cb-quest-active-desc{font-size:11px;color:#2D3A2F;padding:6px;background:#FBFAF5;border-radius:3px;margin-bottom:8px;}
    .cb-quest-active-progress{font-size:11px;color:#2D3A2F;line-height:1.6;padding:6px 8px;
                              background:#FBFAF5;border:1px dashed #C97D9A;border-radius:3px;margin-bottom:8px;font-weight:500;}
    .cb-quest-active-reward{font-size:11px;color:#C97D9A;font-weight:600;text-align:right;margin-bottom:8px;}
    .cb-quest-submit{width:100%;padding:10px;background:#7BA98F;border:2px solid #1E3A2E;border-radius:4px;
                     color:#FBFAF5;font-family:inherit;font-weight:700;font-size:12px;cursor:pointer;letter-spacing:1px;}
    .cb-quest-submit:hover:not(.disabled):not(:disabled){background:#5A8B70;}
    .cb-quest-submit.disabled,.cb-quest-submit:disabled{background:#B8B8B8;cursor:not-allowed;opacity:0.6;}

    .cb-cat-header{font-size:10px;color:#7BA98F;font-weight:700;letter-spacing:1px;
                   margin:8px 0 4px 0;padding:2px 6px;background:#E0EDE4;border-radius:3px;
                   display:inline-block;}

    .cb-log-card{background:#F5F1E8;border:2px dashed #B8967B;border-radius:6px;padding:10px;
                 font-size:11px;color:#2D3A2F;line-height:1.6;}
    .cb-log-day{font-size:12px;color:#1E3A2E;margin:10px 0 5px 0;letter-spacing:1px;font-weight:700;}
    .cb-log-empty{font-size:11px;color:#999;text-align:center;font-style:italic;padding:24px;}

    .cb-settings-row{display:flex;justify-content:space-between;align-items:center;
                     padding:10px 12px;background:#F5F1E8;border:2px solid #1E3A2E;
                     border-radius:5px;margin-bottom:6px;font-size:11px;}
    .cb-settings-btn{background:#FBFAF5;border:2px solid #1E3A2E;border-radius:3px;
                     padding:4px 10px;font-size:10px;color:#2D3A2F;font-family:inherit;
                     cursor:pointer;font-weight:600;}
    .cb-settings-btn:hover{background:#E8A4BC;color:#FBFAF5;}
    .cb-settings-btn:disabled{opacity:0.4;cursor:not-allowed;}
    .cb-settings-btn:disabled:hover{background:#FBFAF5;color:#2D3A2F;}
    .cb-settings-btn.danger:hover{background:#C62828;color:#FBFAF5;border-color:#C62828;}
    .cb-settings-btn.undo:hover{background:#7BA98F;color:#FBFAF5;border-color:#7BA98F;}

    .cb-footer{padding:6px 12px;background:#E0EDE4;border-top:2px solid #1E3A2E;
               display:flex;justify-content:space-between;align-items:center;font-size:9px;}
    .cb-footer-info{color:#6B7A6E;font-weight:500;}
  `;

  // ═══════════════════════════════════════════════════════════════
  // 14. UI 셸
  // ═══════════════════════════════════════════════════════════════

  function buildShell() {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    const backdrop = document.createElement('div');
    backdrop.id = 'cb-backdrop';
    backdrop.addEventListener('click', () => risuai.hideContainer());
    document.body.appendChild(backdrop);
    const root = document.createElement('div');
    root.id = 'cb-root';
    document.body.appendChild(root);
  }

  function renderUI() {
    const root = document.getElementById('cb-root');
    if (!root || !currentState) return;
    const s = currentState;
    root.innerHTML = `
      <div class="cb-header">
        <span class="cb-title">🌿 Cozy-Leaf</span>
        <div class="cb-hbtns">
          <button class="cb-hbtn" id="cb-min">−</button>
          <button class="cb-hbtn" id="cb-close">✕</button>
        </div>
      </div>
      ${renderStatBar(s)}
      <div class="cb-main">
        <div class="cb-body">${renderTabBody()}</div>
        <div class="cb-sidetabs">
          ${renderSideTab('status',   '♥', '상태')}
          ${renderSideTab('inv',      '🎒', '인벤')}
          ${renderSideTab('activity', '⚡', '활동')}
          ${renderSideTab('codex',    '📖', '도감')}
          ${renderSideTab('story',    '🧩', '조각')}
          ${renderSideTab('log',      '📜', '일지')}
          ${renderSideTab('settings', '⚙', '설정')}
        </div>
      </div>
      <div class="cb-footer">
        <span class="cb-footer-info">🌿 Cozy-Leaf v0.7.6b</span>
        <span class="cb-footer-info">${queue.length > 0 ? '큐 ' + queue.length + '개' : '큐 없음'}</span>
      </div>
    `;
    bindCommonHandlers();
    bindTabHandlers();
  }

  function renderStatBar(s) {
    const apCells = Array.from({ length: s.apMax }, (_, i) =>
      `<div class="cb-ap-cell ${i < s.ap ? 'filled' : 'spent'}"></div>`
    ).join('');
    const classes = [];
    if (s.injured) classes.push('injured');
    return `
      <div class="cb-statbar">
        <div class="cb-statbar-top">
          <span class="cb-statbar-day ${classes.join(' ')}">DAY ${s.day}</span>
          <div class="cb-statbar-stats">
            <span class="cb-statbar-stat">🪙 ${s.gold}</span>
            <span class="cb-statbar-stat">⭐ ${s.reputation}</span>
          </div>
        </div>
        <div class="cb-statbar-ap">
          <span class="cb-statbar-ap-label">♥ AP ${s.ap}/${s.apMax}</span>
          <div class="cb-ap-cells">${apCells}</div>
        </div>
      </div>
    `;
  }

  function renderSideTab(id, icon, label) {
    return `
      <div class="cb-sidetab ${currentTab === id ? 'active' : ''}" data-tab="${id}">
        <div class="cb-sidetab-icon">${icon}</div>
        <div class="cb-sidetab-label">${label}</div>
      </div>
    `;
  }

  function renderTabBody() {
    if (currentTab === 'status')   return renderStatusTab();
    if (currentTab === 'inv')      return renderInvTab();
    if (currentTab === 'activity') return renderActivityTab();
    if (currentTab === 'codex')    return renderCodexTab();
    if (currentTab === 'story')    return renderStoryTab();
    if (currentTab === 'log')      return renderLogTab();
    if (currentTab === 'settings') return renderSettingsTab();
    return '';
  }

  // ─── 상태 탭 (스킬 + 진열대) ───
  function renderStatusTab() {
    const s = currentState;
    const skillRows = SKILLS.map(sk => {
      const skill = s.skills[sk.key];
      const nextExp = skill.lv >= SKILL_MAX_LV ? 0 : expForNext(skill.lv);
      const pct = nextExp > 0 ? Math.min(100, (skill.exp / nextExp) * 100) : 100;
      const lvStr = skill.lv >= SKILL_MAX_LV ? 'MAX' : `Lv.${skill.lv}`;
      return `
        <div class="cb-skill-row">
          <div class="cb-skill-icbox">${sk.icon}</div>
          <div class="cb-skill-info">
            <div class="cb-skill-name"><span>${sk.label}</span><span class="cb-skill-lv">${lvStr}</span></div>
            <div class="cb-skill-bar"><div class="cb-skill-bar-fill" style="width:${pct}%"></div></div>
          </div>
        </div>
      `;
    }).join('');

    const dispEntries = Object.entries(s.display).filter(([_, q]) => q > 0);
    const dispSlots = dispEntries.map(([n, q]) => {
      const r = RECIPES.find(x => x.name === n) || RESEARCH_RECIPES.find(x => x.name === n);
      const icon = r ? r.icon : '✨';
      return `<div class="cb-slot cb-item-tap" data-itemname="${n}" title="${n}">${icon}<div class="cb-slot-count">${q}</div></div>`;
    }).join('');
    const dispPad = Array.from({ length: Math.max(0, 4 - dispEntries.length) },
      () => `<div class="cb-slot empty"></div>`).join('');

    return `
      ${renderPreview()}
      <div class="cb-sec-title">스 킬</div>
      <div class="cb-card">${skillRows}</div>
      <div class="cb-sec-title">진 열 대</div>
      <div class="cb-card">
        <div class="cb-grid">${dispSlots}${dispPad}</div>
      </div>
      <div id="cb-item-tooltip" class="cb-item-tooltip"></div>
    `;
  }

  // ─── 인벤 탭 (가방) ───
  function renderInvTab() {
    const s = currentState;
    const invEntries = Object.entries(s.inventory).filter(([_, q]) => q > 0);
    const byCategory = { keepsake: [], basic: [], forage: [], magic: [], magicRaw: [], seed: [], animal: [], junk: [], craft: [] };
    for (const [n, q] of invEntries) {
      const cat = itemCategory(n);
      if (byCategory[cat]) byCategory[cat].push([n, q]);
    }
    function renderCatGrid(items, catName) {
      if (items.length === 0) return '';
      const slots = items.map(([n, q]) =>
        `<div class="cb-slot cb-item-tap" data-itemname="${n}" title="${n}">${itemIcon(n)}<div class="cb-slot-count">${q}</div></div>`
      ).join('');
      return `<div class="cb-cat-header">${catName}</div><div class="cb-grid">${slots}</div>`;
    }
    return `
      ${renderPreview()}
      <div class="cb-sec-title">🎒 가 방</div>
      <div class="cb-inv-hint">아이템을 누르면 이름이 표시돼요</div>
      <div class="cb-card">
        ${renderCatGrid(byCategory.keepsake, '기념품')}
        ${renderCatGrid(byCategory.basic, '기본 재료')}
        ${renderCatGrid(byCategory.forage, '채집 재료')}
        ${renderCatGrid(byCategory.magic, '마법 열매')}
        ${renderCatGrid(byCategory.magicRaw, '특수 재료')}
        ${renderCatGrid(byCategory.seed, '씨앗')}
        ${renderCatGrid(byCategory.animal, '동물')}
        ${renderCatGrid(byCategory.craft, '공예품')}
        ${renderCatGrid(byCategory.junk, '전리품')}
        ${invEntries.length === 0 ? '<div style="text-align:center;color:#999;font-size:10px;padding:20px;">가방이 비었어</div>' : ''}
      </div>
      <div id="cb-item-tooltip" class="cb-item-tooltip"></div>
    `;
  }

  // ─── 활동 탭 ───
  function renderActivityTab() {
    if (activitySub === 'main')            return renderActivityMain();
    if (activitySub === 'bake')            return renderActivityBake();
    if (activitySub === 'sell')            return renderActivitySell();
    if (activitySub === 'out')             return renderActivityOut();
    if (activitySub === 'shop')            return renderActivityShop();
    if (activitySub === 'adv')             return renderActivityAdv();
    if (activitySub === 'forage')          return renderActivityForage();
    if (activitySub === 'hunt')            return renderActivityHunt();
    if (activitySub === 'garden')          return renderActivityGarden();
    if (activitySub === 'plant')           return renderActivityPlant();
    if (activitySub === 'research')        return renderActivityResearch();
    if (activitySub === 'researchSpecial') return renderActivityResearchSpecial();
    if (activitySub === 'craft')           return renderActivityCraft();
    if (activitySub === 'quest')           return renderActivityBoard();
    if (activitySub === 'travel')          return renderActivityTravel();
    return '';
  }

  function renderActivityMain() {
    const s = currentState;
    const rows = ACTIVITIES.map(a => {
      let locked = a.locked;
      if (a.id === 'garden' && isGardenUnlocked(s)) locked = false;
      if (a.id === 'quest' && s.reputation >= BOARD_UNLOCK_REP) locked = false;
      const apStr = a.ap === 0 ? 'AP 0' : (a.ap !== null ? `AP ${a.ap}` : '—');
      const arrow = locked ? '🔒' : '▶';
      // 게시판 뱃지
      let badge = '';
      if (a.id === 'quest' && !locked) {
        if (s.activeQuest) badge = ' <span style="color:#C97D9A;font-weight:600;">· 진행 중</span>';
        else if (s.boardQuests.length > 0) badge = ` <span style="color:#7BA98F;font-weight:600;">· 신규 ${s.boardQuests.length}건</span>`;
      }
      const desc = a.id === 'quest' && locked ? `명성 ${BOARD_UNLOCK_REP} 필요` : (a.desc || '곧 만나요');
      return `
        <div class="cb-act-row ${locked ? 'locked' : ''}" data-act="${a.id}">
          <div class="cb-act-icbox">${a.icon}</div>
          <div class="cb-act-info">
            <div class="cb-act-name">${a.label}${badge}</div>
            <div class="cb-act-meta">
              <span>${desc}</span>
              <span class="cb-act-meta-line"></span>
              <span>${apStr}</span>
            </div>
          </div>
          <div class="cb-act-arrow">${arrow}</div>
        </div>
      `;
    }).join('');
    return `
      ${renderPreview()}
      <div class="cb-sec-title">오 늘 의 활 동</div>
      <div class="cb-act-list">${rows}</div>
    `;
  }

  function renderBakeCard(recipe, isMagic, isForage) {
    const s = currentState;
    const locked = recipe.repReq !== undefined && s.reputation < recipe.repReq;
    // 연구빵인 경우 mat 계산
    const mat = recipe.base ? getResearchRecipeMat(recipe) : recipe.mat;
    const matStr = Object.entries(mat).map(([m, q]) => `${itemIcon(m)}${q}`).join(' · ');
    const isFav = s.favorites.includes(recipe.name);
    const cardClass = isMagic ? 'magic' : (isForage ? 'forage' : '');
    return `
      <div class="cb-bake-card ${cardClass} ${locked ? 'locked' : ''}" data-recipe="${recipe.name}">
        <button class="cb-bake-fav" data-favtoggle="${recipe.name}">${isFav ? '⭐' : '☆'}</button>
        <div class="cb-bake-ic">${recipe.icon}</div>
        <div class="cb-bake-nm">${recipe.name}</div>
        <div class="cb-bake-cost">${matStr}</div>
        <div class="cb-bake-price">${recipe.price}G</div>
      </div>
    `;
  }

  function renderActivityBake() {
    const s = currentState;
    const unlockedResearch = getUnlockedResearchRecipes(s);

    let html = `<button class="cb-back" id="cb-back">◀ 활동으로</button>`;
    html += renderPreview();
    html += `<div class="cb-sec-title">🥐 제 빵</div>`;

    // 즐겨찾기 6칸
    const favSlots = Array.from({ length: FAVORITES_MAX }, (_, i) => {
      const name = s.favorites[i];
      if (!name) return `<div class="cb-fav-slot empty">+</div>`;
      const r = RECIPES.find(x => x.name === name) || RESEARCH_RECIPES.find(x => x.name === name);
      const icon = r?.icon || '✨';
      return `<div class="cb-fav-slot" data-favbake="${name}" title="${name}">${icon}</div>`;
    }).join('');
    html += `
      <div class="cb-fav-strip">
        <div class="cb-fav-label">⭐ 즐겨찾기</div>
        <div class="cb-fav-grid">${favSlots}</div>
      </div>
    `;

    // 필터
    html += `
      <div class="cb-filter-row">
        <div class="cb-filter-chip ${bakeFilter === 'all' ? 'active' : ''}" data-filter="all">전체</div>
        <div class="cb-filter-chip ${bakeFilter === 'basic' ? 'active' : ''}" data-filter="basic">기본</div>
        <div class="cb-filter-chip ${bakeFilter === 'forage' ? 'active' : ''}" data-filter="forage">채집빵</div>
        <div class="cb-filter-chip ${bakeFilter === 'magic' ? 'active' : ''}" data-filter="magic">마법빵</div>
      </div>
    `;

    // 기본빵 (RECIPES) — 필터 all/basic
    if (bakeFilter === 'all' || bakeFilter === 'basic') {
      for (const stage of [0, 20, 40, 60, 80, 100]) {
        const recipesAtStage = RECIPES.filter(r => r.repReq === stage);
        if (recipesAtStage.length === 0) continue;
        const unlocked = s.reputation >= stage;
        html += `<div class="cb-rep-stage ${unlocked ? '' : 'locked'}">${unlocked ? '✦' : '🔒'} 명성 ${stage}</div>`;
        html += '<div class="cb-bake-grid">';
        for (const r of recipesAtStage) html += renderBakeCard(r, false, false);
        html += '</div>';
      }
    }

    // 채집빵 — 필터 all/forage
    if (bakeFilter === 'all' || bakeFilter === 'forage') {
      const forageRecipes = unlockedResearch.filter(r => r.category === 'forage');
      if (forageRecipes.length > 0) {
        html += `<div class="cb-rep-stage forage">🌿 채집빵 (${forageRecipes.length}종 발견)</div>`;
        html += '<div class="cb-bake-grid">';
        for (const r of forageRecipes) html += renderBakeCard(r, false, true);
        html += '</div>';
      } else if (bakeFilter === 'forage') {
        html += `<div class="cb-info-box">아직 발견한 채집빵이 없어<br>연구 탭에서 조합해봐</div>`;
      }
    }

    // 마법빵 — 필터 all/magic
    if (bakeFilter === 'all' || bakeFilter === 'magic') {
      const magicRecipes = unlockedResearch.filter(r => r.category === 'magic');
      if (magicRecipes.length > 0) {
        html += `<div class="cb-rep-stage magic">✨ 마법빵 (${magicRecipes.length}종 발견)</div>`;
        html += '<div class="cb-bake-grid">';
        for (const r of magicRecipes) html += renderBakeCard(r, true, false);
        html += '</div>';
      } else if (bakeFilter === 'magic') {
        html += `<div class="cb-info-box">아직 발견한 마법빵이 없어<br>명성 60에 도달하거나 연구로 발견</div>`;
      }
    }

    html += `
      <div class="cb-info-box">
        🥐 기본빵 AP 2 · 🌿 채집빵 & ✨ 마법빵 AP 3<br>
        한 세션 최대 ${BAKE_SESSION_MAX}개 · 특수빵 섞이면 세션 AP 3
      </div>
    `;
    return html;
  }

  function renderActivitySell() {
    const s = currentState;
    const dispCount = Object.values(s.display).reduce((a, b) => a + b, 0);
    const sellBtn = dispCount > 0
      ? `<div class="cb-sell-opt" id="cb-sell">
           <div class="cb-sell-opt-icon">☼</div>
           <div class="cb-sell-opt-nm">영 업 하 기</div>
           <div class="cb-sell-opt-meta">AP 0 · 지금 진열대의 빵을 팔아요</div>
         </div>`
      : `<div class="cb-sell-opt" style="opacity:0.4;cursor:default;">
           <div class="cb-sell-opt-icon">☼</div>
           <div class="cb-sell-opt-nm">영 업 하 기</div>
           <div class="cb-sell-opt-meta">진열대가 비어있어요</div>
         </div>`;
    return `
      <button class="cb-back" id="cb-back">◀ 활동으로</button>
      ${renderPreview()}
      <div class="cb-sec-title">☼ 영 업</div>
      <div class="cb-info-box">
        진열대에 빵 <b>${dispCount}개</b><br>
        ${dispCount > 0
          ? '영업을 누르면 손님들이 빵을 사가요<br><span style="font-size:9px;color:#7BA98F;">확률로 팔리니 안 팔린 빵은 다음에 또 팔 수 있어요</span>'
          : '먼저 빵을 구워 진열대에 올려주세요'}
      </div>
      ${sellBtn}
      <div class="cb-sell-opt end" id="cb-endday">
        <div class="cb-sell-opt-icon">☾</div>
        <div class="cb-sell-opt-nm">하 루 마 감</div>
        <div class="cb-sell-opt-meta">AP 0 · 다음 날로 · 행동력 회복</div>
      </div>
    `;
  }

  function renderActivityOut() {
    const rows = OUT_SUBS.map(o => `
      <div class="cb-act-row" data-out="${o.id}">
        <div class="cb-act-icbox">${o.icon}</div>
        <div class="cb-act-info">
          <div class="cb-act-name">${o.label}</div>
          <div class="cb-act-meta">
            <span>${o.desc}</span>
            <span class="cb-act-meta-line"></span>
            <span>AP ${o.ap}</span>
          </div>
        </div>
        <div class="cb-act-arrow">▶</div>
      </div>
    `).join('');
    return `
      <button class="cb-back" id="cb-back">◀ 활동으로</button>
      ${renderPreview()}
      <div class="cb-sec-title">🚪 외 출</div>
      <div class="cb-act-list">${rows}</div>
    `;
  }

  function renderActivityShop() {
    const s = currentState;
    const sellable = Object.entries(s.inventory)
      .filter(([n, q]) => q > 0 && !BASIC_MAT.includes(n) && !KEEPSAKE_ITEMS.includes(n))
      .map(([n, q]) => ({ name: n, qty: q, price: itemPrice(n) }));

    const buyMats = Object.entries(MAT_PRICES).map(([mat, price]) => `
      <div class="cb-shop-card" data-buy="${mat}">
        <div class="cb-shop-card-icon">${MAT_ICON[mat]}</div>
        <div class="cb-shop-card-info">
          <div class="cb-shop-card-nm">${mat}</div>
          <div class="cb-shop-card-price">${price}G</div>
          <div class="cb-shop-card-owned">보유 ${s.inventory[mat] || 0}</div>
        </div>
      </div>
    `).join('');

    const shopSeeds = SEEDS.filter(seed => seed.buyPrice !== null);
    const buySeeds = shopSeeds.map(seed => `
      <div class="cb-shop-card" data-buy="${seed.name}">
        <div class="cb-shop-card-icon">${seed.icon}</div>
        <div class="cb-shop-card-info">
          <div class="cb-shop-card-nm">${seed.name}</div>
          <div class="cb-shop-card-price">${seed.buyPrice}G</div>
          <div class="cb-shop-card-owned">보유 ${s.inventory[seed.name] || 0}</div>
        </div>
      </div>
    `).join('');

    const buyAnimals = ANIMALS.map(animal => `
      <div class="cb-shop-card" data-buy="${animal.name}">
        <div class="cb-shop-card-icon">${animal.icon}</div>
        <div class="cb-shop-card-info">
          <div class="cb-shop-card-nm">${animal.name}</div>
          <div class="cb-shop-card-price">${animal.buyPrice}G</div>
          <div class="cb-shop-card-owned">보유 ${s.inventory[animal.name] || 0}</div>
        </div>
      </div>
    `).join('');

    const sellCards = sellable.length > 0
      ? sellable.map(it => `
          <div class="cb-shop-card" data-sellmat="${it.name}">
            <div class="cb-shop-card-icon">${itemIcon(it.name)}</div>
            <div class="cb-shop-card-info">
              <div class="cb-shop-card-nm">${it.name}</div>
              <div class="cb-shop-card-price">+${it.price}G</div>
              <div class="cb-shop-card-owned">보유 ${it.qty}</div>
            </div>
          </div>
        `).join('')
      : '<div style="text-align:center;color:#999;font-size:10px;padding:24px;">팔 게 없어요</div>';

    return `
      <button class="cb-back" id="cb-back">◀ 외출로</button>
      ${renderPreview()}
      <div class="cb-sec-title">🛒 식 료 품 점</div>
      <div class="cb-subtabs">
        <div class="cb-subtab ${shopSub === 'buy' ? 'active' : ''}" data-shopsub="buy">🛒 구매</div>
        <div class="cb-subtab ${shopSub === 'sell' ? 'active' : ''}" data-shopsub="sell">💰 판매</div>
      </div>
      <div class="cb-info-box">
        ${shopSub === 'buy'
          ? '재료·씨앗·동물 클릭 → 장보기 큐에 추가<br>한 번 다녀오기 = AP 1'
          : '아이템 클릭 → 판매 목록 추가<br>판매는 장보기와 함께 처리'}
      </div>
      ${shopSub === 'buy'
        ? `<div class="cb-cat-header">기본 재료</div>
           <div class="cb-shop-grid">${buyMats}</div>
           <div class="cb-cat-header">씨앗</div>
           <div class="cb-shop-grid">${buySeeds}</div>
           <div class="cb-cat-header">동물</div>
           <div class="cb-shop-grid">${buyAnimals}</div>`
        : `<div class="cb-shop-grid">${sellCards}</div>`}
    `;
  }

  function renderActivityAdv() {
    const rows = ADV_SUBS.map(o => `
      <div class="cb-act-row" data-adv="${o.id}">
        <div class="cb-act-icbox">${o.icon}</div>
        <div class="cb-act-info">
          <div class="cb-act-name">${o.label}</div>
          <div class="cb-act-meta">
            <span>${o.desc}</span>
            <span class="cb-act-meta-line"></span>
            <span>AP ${o.ap}</span>
          </div>
        </div>
        <div class="cb-act-arrow">▶</div>
      </div>
    `).join('');
    return `
      <button class="cb-back" id="cb-back">◀ 활동으로</button>
      ${renderPreview()}
      <div class="cb-sec-title">🗺 모 험</div>
      <div class="cb-act-list">${rows}</div>
    `;
  }

  function renderActivityForage() {
    const s = currentState;
    const forLv = s.skills.foraging.lv;
    return `
      <button class="cb-back" id="cb-back">◀ 모험으로</button>
      ${renderPreview()}
      <div class="cb-sec-title">🌿 채 집</div>
      <div class="cb-info-box">
        현재 채집 Lv.${forLv}<br>
        무엇을 얻을지는 숲의 마음<br>
        <span style="font-size:9px;color:#7BA98F;">발견한 재료는 📖 도감에서 확인</span>
      </div>
      <div class="cb-sell-opt" id="cb-forage-btn">
        <div class="cb-sell-opt-icon">🌿</div>
        <div class="cb-sell-opt-nm">채 집 다 녀 오 기</div>
        <div class="cb-sell-opt-meta">AP 2</div>
      </div>
    `;
  }

  function renderActivityHunt() {
    const s = currentState;
    const advLv = s.skills.adventure.lv;
    const available = MOBS.filter(m => m.unlockLv <= advLv);
    const rows = available.map(mob => {
      let winRate = mob.win + (advLv - mob.unlockLv) * 0.05;
      winRate = Math.min(0.95, Math.max(0.1, winRate));
      const winPct = Math.round(winRate * 100);
      const dropInfo = mob.heart ? `${mob.heart} ${mob.drop}` : mob.drop;
      return `
        <div class="cb-mob-card" data-mob="${mob.id}">
          <div class="cb-mob-icon">${mob.icon}</div>
          <div class="cb-mob-info">
            <div class="cb-mob-name">${mob.name}</div>
            <div class="cb-mob-meta">드랍: ${dropInfo}</div>
          </div>
          <div class="cb-mob-win">${winPct}%</div>
        </div>
      `;
    }).join('');
    return `
      <button class="cb-back" id="cb-back">◀ 모험으로</button>
      ${renderPreview()}
      <div class="cb-sec-title">🗡 사 냥</div>
      <div class="cb-info-box">
        현재 모험 Lv.${advLv}${s.injured ? ' 🩹 부상 상태' : ''}<br>
        실패 시 부상 → 다음 하루 시작 AP -2<br>
        <span style="font-size:9px;color:#7BA98F;">아직 만나지 못한 마물은 📖 도감에서 확인</span>
      </div>
      ${available.length > 0 ? rows : '<div style="text-align:center;color:#999;font-size:10px;padding:20px;">도전 가능한 마물이 없어</div>'}
    `;
  }

  function renderActivityGarden() {
    const s = currentState;
    const gLv = s.skills.gardening.lv;
    const maxSlots = getGardenMaxSlots(gLv);
    const slotsHTML = [0, 1, 2].map(i => {
      const slot = s.garden[i];
      const unlocked = i < maxSlots;
      if (!unlocked) {
        const req = i === 1 ? 3 : 6;
        return `
          <div class="cb-garden-slot locked">
            <div class="cb-garden-lock">🔒</div>
            <div class="cb-garden-status">정원 Lv ${req}</div>
          </div>
        `;
      }
      if (!slot) {
        return `
          <div class="cb-garden-slot" data-plant-slot="${i}">
            <div class="cb-garden-icon">➕</div>
            <div class="cb-garden-name">심기</div>
            <div class="cb-garden-status">AP 2</div>
          </div>
        `;
      }
      if (slot.type === 'seed') {
        const seed = SEEDS.find(x => x.id === slot.id);
        const daysAgo = s.day - slot.lastYieldDay;
        const canHarv = daysAgo >= GARDEN_CYCLE_DAYS;
        const status = canHarv ? '수확 가능' : `${GARDEN_CYCLE_DAYS - daysAgo}일 후`;
        return `
          <div class="cb-garden-slot ${canHarv ? 'ready' : 'growing'}" ${canHarv ? `data-harvest-slot="${i}"` : ''}>
            <div class="cb-garden-icon">${seed?.icon || '🌱'}</div>
            <div class="cb-garden-name">${seed?.name || ''}</div>
            <div class="cb-garden-status ${canHarv ? 'ready' : ''}">${status}</div>
          </div>
        `;
      }
      if (slot.type === 'animal') {
        const animal = ANIMALS.find(x => x.id === slot.id);
        const canHarv = (slot.storedYield || 0) > 0;
        return `
          <div class="cb-garden-slot ${canHarv ? 'ready' : 'growing'}" ${canHarv ? `data-harvest-slot="${i}"` : ''}>
            <div class="cb-garden-icon">${animal?.icon || '🐾'}</div>
            <div class="cb-garden-name">${animal?.name || ''}</div>
            <div class="cb-garden-status ${canHarv ? 'ready' : ''}">저장 ${slot.storedYield || 0}/${ANIMAL_MAX_STORE}</div>
          </div>
        `;
      }
      return '';
    }).join('');
    return `
      <button class="cb-back" id="cb-back">◀ 활동으로</button>
      ${renderPreview()}
      <div class="cb-sec-title">🌱 정 원</div>
      <div class="cb-info-box">
        정원 Lv.${gLv} · ${maxSlots}칸 사용 가능<br>
        심기 AP 2 · 수확 AP 1
      </div>
      <div class="cb-garden-grid">${slotsHTML}</div>
    `;
  }

  function renderActivityPlant() {
    const s = currentState;
    const availableSeeds = SEEDS.filter(x => (s.inventory[x.name] || 0) > 0);
    const availableAnimals = ANIMALS.filter(x => (s.inventory[x.name] || 0) > 0);
    const seedCards = availableSeeds.map(seed => `
      <div class="cb-plant-card" data-plantid="${seed.id}">
        <div class="cb-plant-icon">${seed.icon}</div>
        <div class="cb-plant-info">
          <div class="cb-plant-name">${seed.name}</div>
          <div class="cb-plant-desc">3일마다 ${seed.yields}</div>
          <div class="cb-plant-owned">보유 ${s.inventory[seed.name]}</div>
        </div>
      </div>
    `).join('');
    const animalCards = availableAnimals.map(animal => `
      <div class="cb-plant-card" data-plantid="${animal.id}">
        <div class="cb-plant-icon">${animal.icon}</div>
        <div class="cb-plant-info">
          <div class="cb-plant-name">${animal.name}</div>
          <div class="cb-plant-desc">3일마다 ${animal.yields} (최대 ${ANIMAL_MAX_STORE})</div>
          <div class="cb-plant-owned">보유 ${s.inventory[animal.name]}</div>
        </div>
      </div>
    `).join('');
    const empty = availableSeeds.length === 0 && availableAnimals.length === 0;
    return `
      <button class="cb-back" id="cb-back-plant">◀ 정원으로</button>
      ${renderPreview()}
      <div class="cb-sec-title">🌱 슬롯 ${plantTargetSlot + 1}에 심기</div>
      <div class="cb-info-box">심기 = AP 2</div>
      ${availableSeeds.length > 0 ? '<div class="cb-cat-header">🌰 씨앗</div>' : ''}
      ${seedCards}
      ${availableAnimals.length > 0 ? '<div class="cb-cat-header">🐮 동물</div>' : ''}
      ${animalCards}
      ${empty ? '<div style="text-align:center;color:#999;font-size:10px;padding:20px;">심을 게 없어요<br>상점이나 사냥으로 씨앗을 구하세요</div>' : ''}
    `;
  }

  // ─── 연구 UI ───
  function renderActivityResearch() {
    const s = currentState;
    // 베이스빵 선택 화면
    const cards = BASE_BREADS.map(base => {
      // 명성 체크
      const repLocked = s.reputation < base.repReq;
      // 재료 보유 체크 (베이스빵 재료만)
      let hasBase = true;
      for (const [mat, qty] of Object.entries(base.mat)) {
        if ((s.inventory[mat] || 0) < qty) { hasBase = false; break; }
      }
      const canUse = !repLocked && hasBase;
      const matStr = Object.entries(base.mat).map(([m, q]) => `${itemIcon(m)}${q}`).join(' · ');
      let note = '';
      if (repLocked) note = `<div class="cb-research-note">명성 ${base.repReq} 필요</div>`;
      else if (!hasBase) note = '<div class="cb-research-note">재료 부족</div>';
      return `
        <div class="cb-research-card ${canUse ? '' : 'locked'}" data-researchbase="${canUse ? base.name : ''}">
          <div class="cb-research-icon">${repLocked ? '🔒' : base.icon}</div>
          <div class="cb-research-info">
            <div class="cb-research-name">${base.name}</div>
            <div class="cb-research-mat">${matStr}</div>
            ${note}
          </div>
        </div>
      `;
    }).join('');
    return `
      <button class="cb-back" id="cb-back">◀ 활동으로</button>
      ${renderPreview()}
      <div class="cb-sec-title">🔬 레 시 피 연 구</div>
      <div class="cb-info-box">
        1단계 · 베이스빵 선택<br>
        어떤 빵에 특수재료를 넣어볼까?<br>
        <span style="font-size:9px;color:#C97D9A;">시도 = AP 3 · 실패해도 베이스빵은 나옴</span>
      </div>
      ${cards}
    `;
  }

  function renderActivityResearchSpecial() {
    const s = currentState;
    const base = BASE_BREADS.find(b => b.name === researchBaseName);
    if (!base) { activitySub = 'research'; return renderActivityResearch(); }

    const cards = SPECIAL_INGREDIENTS.map(ing => {
      const stdQty = SPECIAL_INGR_STANDARD[ing.name];
      const owned = s.inventory[ing.name] || 0;
      const hasSpecial = owned >= stdQty;
      // 베이스빵 재료도 다시 체크
      let hasBase = true;
      for (const [mat, qty] of Object.entries(base.mat)) {
        if ((s.inventory[mat] || 0) < qty) { hasBase = false; break; }
      }
      const canTry = hasSpecial && hasBase;
      return `
        <div class="cb-research-card ${canTry ? '' : 'locked'}" data-researchspecial="${ing.name}">
          <div class="cb-research-icon">${ing.icon}</div>
          <div class="cb-research-info">
            <div class="cb-research-name">${ing.name}</div>
            <div class="cb-research-mat">조합당 ${stdQty}개 필요 (보유 ${owned})</div>
            ${!hasSpecial ? '<div class="cb-research-note">재료 부족</div>' : ''}
            ${!hasBase && hasSpecial ? '<div class="cb-research-note">베이스빵 재료 부족</div>' : ''}
          </div>
        </div>
      `;
    }).join('');

    const baseMatStr = Object.entries(base.mat).map(([m, q]) => `${itemIcon(m)}${q}`).join(' · ');
    return `
      <button class="cb-back" id="cb-back-research">◀ 베이스빵 다시 고르기</button>
      ${renderPreview()}
      <div class="cb-sec-title">🔬 연 구</div>
      <div class="cb-info-box">
        선택한 베이스빵: <b>${base.icon} ${base.name}</b> (${baseMatStr})<br>
        2단계 · 특수재료 선택<br>
        <span style="font-size:9px;color:#C97D9A;">클릭 → 큐에 추가 · AP 3</span>
      </div>
      ${cards}
    `;
  }

  // ─── 공예 (v0.7) ───
  function renderActivityCraft() {
    const s = currentState;
    const basic = CRAFT_RECIPES.filter(r => r.tier === 'basic');
    const special = CRAFT_RECIPES.filter(r => r.tier === 'special');

    function renderCard(recipe) {
      let has = true;
      for (const [mat, qty] of Object.entries(recipe.mat)) {
        if ((s.inventory[mat] || 0) < qty) { has = false; break; }
      }
      const matStr = Object.entries(recipe.mat).map(([m, q]) => `${itemIcon(m)}${m} ${q}`).join(' · ');
      return `
        <div class="cb-craft-card ${has ? '' : 'locked'} ${recipe.tier === 'special' ? 'special' : ''}" data-craft="${recipe.id}">
          <div class="cb-craft-icon">${recipe.icon}</div>
          <div class="cb-craft-info">
            <div class="cb-craft-name">${recipe.name}</div>
            <div class="cb-craft-mat">${matStr}</div>
            <div class="cb-craft-price">${recipe.price}G</div>
          </div>
        </div>
      `;
    }

    return `
      <button class="cb-back" id="cb-back">◀ 활동으로</button>
      ${renderPreview()}
      <div class="cb-sec-title">🧿 공 예</div>
      <div class="cb-info-box">
        부적·장식품 만들기 · AP 2<br>
        판매하거나 의뢰 제출에 사용
      </div>
      <div class="cb-cat-header">부적 (전리품)</div>
      ${basic.map(renderCard).join('')}
      <div class="cb-cat-header">특별한 장식품 (전리품 + 열매/채집)</div>
      ${special.map(renderCard).join('')}
    `;
  }

  // ─── 게시판 (v0.7) ───
  function renderActivityBoard() {
    const s = currentState;
    let html = `<button class="cb-back" id="cb-back">◀ 활동으로</button>${renderPreview()}<div class="cb-sec-title">📋 의 뢰 게 시 판</div>`;

    if (s.activeQuest) {
      const quest = QUESTS.find(q => q.id === s.activeQuest.id);
      if (!quest) return html + '<div class="cb-info-box">알 수 없는 의뢰</div>';
      const isComplete = isQuestComplete(s, quest);
      const progressLines = [];
      if (quest.type === 'item') {
        for (const [name, count] of Object.entries(quest.requires)) {
          const has = (s.inventory[name] || 0) + (s.display[name] || 0);
          const ok = has >= count;
          progressLines.push(`${ok ? '✓' : '·'} ${itemIcon(name)} ${name}: ${Math.min(has, count)}/${count}`);
        }
      } else if (quest.type === 'hunt') {
        const killed = s.codex.mobs[quest.huntTarget]?.killed || 0;
        const done = killed - (s.activeQuest.huntBaseline || 0);
        const mob = MOBS.find(m => m.id === quest.huntTarget);
        const ok = done >= quest.huntCount;
        progressLines.push(`${ok ? '✓' : '·'} ${mob?.icon || ''} ${mob?.name || ''} 처치: ${Math.min(done, quest.huntCount)}/${quest.huntCount}`);
      }
      html += `
        <div class="cb-quest-active">
          <div class="cb-quest-active-header">
            <div class="cb-quest-active-name">📋 ${quest.name}</div>
            <div class="cb-quest-active-cat">${categoryLabel(quest.category)}</div>
          </div>
          <div class="cb-quest-active-desc">${quest.desc}</div>
          <div class="cb-quest-active-progress">${progressLines.join('<br>')}</div>
          <div class="cb-quest-active-reward">보상: +${quest.goldReward}G · 명성 +${quest.repReward}</div>
          <button class="cb-quest-submit ${isComplete ? '' : 'disabled'}" id="cb-submit-quest" ${isComplete ? '' : 'disabled'}>
            ${isComplete ? '✦ 제출하기' : '조건 미충족'}
          </button>
        </div>
        <div class="cb-info-box">
          한 번에 하나의 의뢰만 진행 가능<br>
          완수 후 다음 갱신 때 새 3건 등장
        </div>
      `;
    } else if (s.boardQuests && s.boardQuests.length > 0) {
      const daysUntilRefresh = BOARD_REFRESH_DAYS - (s.day - s.boardRefreshDay);
      html += `
        <div class="cb-info-box">
          게시판에 <b>${s.boardQuests.length}건</b>의 의뢰가 있어<br>
          하나 수락하면 <span style="color:#C97D9A;">나머지는 사라져</span><br>
          <span style="color:#6B7A6E;font-size:10px;">다음 갱신: D-${Math.max(1, daysUntilRefresh)}</span>
        </div>
      `;
      for (const qid of s.boardQuests) {
        const quest = QUESTS.find(q => q.id === qid);
        if (!quest) continue;
        html += `
          <div class="cb-quest-card" data-acceptquest="${quest.id}">
            <div class="cb-quest-header">
              <div class="cb-quest-name">${quest.name}</div>
              <div class="cb-quest-cat">${categoryLabel(quest.category)}</div>
            </div>
            <div class="cb-quest-desc">${quest.desc}</div>
            <div class="cb-quest-reward">보상: +${quest.goldReward}G · 명성 +${quest.repReward}</div>
          </div>
        `;
      }
    } else {
      const daysUntilRefresh = s.boardRefreshDay > 0 ? BOARD_REFRESH_DAYS - (s.day - s.boardRefreshDay) : null;
      html += `
        <div class="cb-info-box">
          지금은 게시판이 비어있어<br>
          ${daysUntilRefresh !== null
            ? `<span style="color:#C97D9A;">다음 갱신: D-${Math.max(1, daysUntilRefresh)}</span> (하루 마감 시 갱신)`
            : '하루 마감 시 새 의뢰가 등장할 거야'}
        </div>
      `;
    }
    return html;
  }

  // ─── 여행 (v0.7.3) ───
  function renderActivityTravel() {
    const s = currentState;
    const cards = TRAVELS.map(t => {
      const canAfford = s.gold >= t.price;
      return `
        <div class="cb-travel-card ${canAfford ? '' : 'locked'}" data-travel="${t.id}">
          <div class="cb-travel-icon">${t.icon}</div>
          <div class="cb-travel-info">
            <div class="cb-travel-name">${t.name}</div>
            <div class="cb-travel-desc">${t.desc}</div>
            <div class="cb-travel-price">${t.price.toLocaleString()}G</div>
          </div>
        </div>
      `;
    }).join('');
    return `
      <button class="cb-back" id="cb-back">◀ 활동으로</button>
      ${renderPreview()}
      <div class="cb-sec-title">🎫 여 행</div>
      <div class="cb-info-box">
        모은 골드로 잠시 문을 닫고 다녀오는 휴가<br>
        AP 소모 없음 · 서사는 대화 안에서 흘러가요<br>
        <span style="color:#6B7A6E;font-size:10px;">현재 잔고 ${s.gold.toLocaleString()}G</span>
      </div>
      ${cards}
    `;
  }
  function renderCodexTab() {
    return `
      <div class="cb-subtabs">
        <div class="cb-subtab ${codexSub === 'mobs' ? 'active' : ''}" data-codexsub="mobs">🗡 마물</div>
        <div class="cb-subtab ${codexSub === 'forages' ? 'active' : ''}" data-codexsub="forages">🌿 채집</div>
        <div class="cb-subtab ${codexSub === 'recipes' ? 'active' : ''}" data-codexsub="recipes">🥐 레시피</div>
      </div>
      ${codexSub === 'mobs' ? renderCodexMobs() : (codexSub === 'forages' ? renderCodexForages() : renderCodexRecipes())}
    `;
  }

  function renderCodexMobs() {
    const s = currentState;
    const discovered = MOBS.filter(m => (s.codex.mobs[m.id]?.encounters || 0) > 0).length;
    const total = MOBS.length;
    const cards = MOBS.map(m => {
      const entry = s.codex.mobs[m.id];
      const count = entry?.encounters || 0;
      if (count === 0) {
        return `
          <div class="cb-codex-card unknown">
            <div class="cb-codex-icon silhouette">${m.icon}</div>
            <div class="cb-codex-name">???</div>
            <div class="cb-codex-info">모험 Lv ${m.unlockLv} 필요</div>
          </div>
        `;
      }
      return `
        <div class="cb-codex-card">
          <div class="cb-codex-icon">${m.icon}</div>
          <div class="cb-codex-name">${m.name}</div>
          <div class="cb-codex-info">
            ${m.heart || ''} ${m.drop}${m.effect ? ` (${m.effect})` : ''}<br>
            승률 ${Math.round(m.win * 100)}%
          </div>
        </div>
      `;
    }).join('');
    return `
      <div class="cb-codex-progress">진행률 ${discovered} / ${total}</div>
      <div class="cb-codex-grid">${cards}</div>
    `;
  }

  function renderCodexForages() {
    const s = currentState;
    const discovered = FORAGE_ITEMS.filter(f => (s.codex.forages[f.id]?.count || 0) > 0).length;
    const total = FORAGE_ITEMS.length;
    const cards = FORAGE_ITEMS.map(f => {
      const entry = s.codex.forages[f.id];
      const count = entry?.count || 0;
      if (count === 0) {
        return `
          <div class="cb-codex-card unknown">
            <div class="cb-codex-icon silhouette">${f.icon}</div>
            <div class="cb-codex-name">???</div>
            <div class="cb-codex-info">채집 Lv ${f.unlockLv} 필요</div>
          </div>
        `;
      }
      return `
        <div class="cb-codex-card">
          <div class="cb-codex-icon">${f.icon}</div>
          <div class="cb-codex-name">${f.name}</div>
          <div class="cb-codex-info">가치 ${f.price}G</div>
        </div>
      `;
    }).join('');
    return `
      <div class="cb-codex-progress">진행률 ${discovered} / ${total}</div>
      <div class="cb-codex-grid">${cards}</div>
    `;
  }

  function renderCodexRecipes() {
    const s = currentState;
    const discovered = getDiscoveredResearch(s);
    const groups = getResearchByIngredient();
    const total = RESEARCH_RECIPES.length;

    let html = `<div class="cb-codex-progress">🥐 연구 진행률 ${discovered.size} / ${total}</div>`;

    for (const [ingName, group] of Object.entries(groups)) {
      const found = group.recipes.filter(r => discovered.has(r.id)).length;
      const totalInGroup = group.recipes.length;
      const ing = group.ingredient;
      const anyFound = found > 0;

      const listHtml = group.recipes.map(r => {
        const isFound = discovered.has(r.id);
        if (isFound) {
          return `
            <div class="cb-recipe-row discovered">
              <div class="cb-recipe-row-icon">${r.icon}</div>
              <div class="cb-recipe-row-nm">${r.name}</div>
              <div class="cb-recipe-row-base">${r.base}</div>
            </div>
          `;
        } else if (anyFound) {
          // 하나라도 발견 → 베이스빵 힌트 공개
          return `
            <div class="cb-recipe-row locked">
              <div class="cb-recipe-row-icon">🔒</div>
              <div class="cb-recipe-row-nm">???</div>
              <div class="cb-recipe-row-base">${r.base} 파생</div>
            </div>
          `;
        } else {
          return '';  // 미개척 → 개별 항목 숨김
        }
      }).join('');

      // 미개척 카테고리는 "🔒 N종" 표시
      const hiddenBlock = !anyFound
        ? `<div class="cb-recipe-row locked">
             <div class="cb-recipe-row-icon">🔒</div>
             <div class="cb-recipe-row-nm">${totalInGroup}종 (미개척)</div>
             <div class="cb-recipe-row-base">첫 발견 시 목록 공개</div>
           </div>`
        : '';

      html += `
        <div class="cb-recipe-group">
          <div class="cb-recipe-group-header">
            <div class="cb-recipe-group-icon">${ing.icon}</div>
            <div class="cb-recipe-group-name">${ingName}</div>
            <div class="cb-recipe-group-count">${found}/${totalInGroup}</div>
          </div>
          <div class="cb-recipe-list">${listHtml}${hiddenBlock}</div>
        </div>
      `;
    }
    return html;
  }

  // ─── 조각/편지 탭 (v0.7.1) ───
  let letterOpen = false;

  function renderStoryTab() {
    const s = currentState;
    const collected = FRAGMENTS.filter(f => s.fragments[f.key]).length;
    const total = FRAGMENTS.length;

    const fragCards = FRAGMENTS.map(f => {
      const got = s.fragments[f.key];
      return `
        <div class="cb-frag-card ${got ? 'got' : ''}">
          <div class="cb-frag-icon">${got ? f.icon : '🔒'}</div>
          <div class="cb-frag-info">
            <div class="cb-frag-name" style="${got ? `color:${f.color};` : ''}">${got ? f.name : '???의 조각'}</div>
            <div class="cb-frag-desc">${got ? '수집 완료' : f.desc}</div>
          </div>
        </div>
      `;
    }).join('');

    let letterHTML;
    if (!s.letterUnlocked) {
      const remaining = total - collected;
      letterHTML = `
        <div class="cb-letter-locked">
          <div class="cb-letter-locked-icon">🔒</div>
          <div class="cb-letter-locked-title">할머니의 편지</div>
          <div class="cb-letter-locked-desc">조각 ${remaining}개 더 모으면 편지가 도착해</div>
        </div>
      `;
    } else if (!letterOpen) {
      letterHTML = `
        <div class="cb-letter-envelope" id="cb-open-letter">
          <div class="cb-letter-envelope-icon">💌</div>
          <div class="cb-letter-envelope-title">할머니의 편지</div>
          <div class="cb-letter-envelope-desc">✉ 열어보기</div>
        </div>
      `;
    } else {
      const body = GRANDMA_LETTER.replace(/\n/g, '<br>');
      letterHTML = `
        <div class="cb-letter-open">
          <div class="cb-letter-header">
            <span>💌 할머니의 편지</span>
            <button class="cb-letter-close" id="cb-close-letter">✕ 접기</button>
          </div>
          <div class="cb-letter-body">${body}</div>
          <div class="cb-teacan-note">🫖 가방에 <b>할머니의 홍차 캔</b>이 담겼어요.</div>
        </div>
      `;
    }

    return `
      ${renderPreview()}
      <div class="cb-sec-title">🧩 조 각 · 편 지</div>
      <div class="cb-info-box">
        생활을 하며 조각 다섯 개를 모아보세요<br>
        <span style="color:#C97D9A;">진행률 ${collected} / ${total}</span>
      </div>
      <div class="cb-frag-list">${fragCards}</div>
      <div style="height:12px;"></div>
      ${letterHTML}
    `;
  }

  // ─── 일지 / 설정 ───
  function renderLogTab() {
    const s = currentState;
    if (!s.log || s.log.length === 0) {
      return `${renderPreview()}<div class="cb-sec-title">일 지</div><div class="cb-log-empty">아직 기록이 없어<br>오늘을 시작해보자</div>`;
    }
    const entries = s.log.map(e => `
      <div class="cb-log-day">DAY ${e.day}</div>
      <div class="cb-log-card">${e.items.join('<br>')}</div>
    `).join('');
    return `${renderPreview()}<div class="cb-sec-title">일 지</div>${entries}`;
  }

  function renderSettingsTab() {
    const s = currentState;
    const canUndo = !!s.previousSnapshot;
    return `
      ${renderPreview()}
      <div class="cb-sec-title">설 정</div>
      <div class="cb-settings-row">
        <span>직전 턴 되돌리기<br><span style="font-size:9px;color:#6B7A6E;">리롤 후 상태 복구</span></span>
        <button class="cb-settings-btn undo" id="cb-undo" ${canUndo ? '' : 'disabled'}>↺ 되돌리기</button>
      </div>
      <div class="cb-settings-row">
        <span>큐 비우기</span>
        <button class="cb-settings-btn" id="cb-clear-queue">비우기</button>
      </div>
      <div class="cb-settings-row">
        <span>새 게임 (이 챗방)</span>
        <button class="cb-settings-btn danger" id="cb-reset">초기화</button>
      </div>
      <div class="cb-settings-row">
        <span style="font-size:10px;color:#6B7A6E;">🌿 Cozy-Leaf v0.7.6 베타<br>챗 보호 · 연구 명성 체크 · 스킬 성장 완화</span>
      </div>
    `;
  }

  // ─── 미리보기 ───
  function renderPreview() {
    if (queue.length === 0) {
      return `
        <div class="cb-preview">
          <div class="cb-preview-label">✦ 지금 보낼 행동 ✦</div>
          <div class="cb-preview-empty">활동에서 행동을 추가해봐</div>
        </div>
      `;
    }
    const totalAP = queueTotalAP();
    const apWarn = totalAP > (currentState?.ap || 0) ? 'warn' : '';
    const items = queue.map((item, idx) => {
      let title = '', detail = '', ap = 0;
      if (item.type === 'bake') {
        const list = Object.entries(item.items).map(([n, q]) => {
          const r = RECIPES.find(x => x.name === n) || RESEARCH_RECIPES.find(x => x.name === n);
          return `${r?.icon || '🥐'} ${n}×${q}`;
        }).join(', ');
        title = '🥐 제빵'; detail = list; ap = bakeSessionAP(item);
      } else if (item.type === 'sell') {
        title = '☼ 영업'; ap = 0;
      } else if (item.type === 'shop') {
        const list = Object.entries(item.items).map(([n, q]) => `${itemIcon(n)}${n}×${q}`).join(', ');
        title = '🛒 장보기'; detail = list; ap = 1;
      } else if (item.type === 'sellItem') {
        const list = Object.entries(item.items).map(([n, q]) => `${itemIcon(n)}${n}×${q}`).join(', ');
        title = '💰 판매'; detail = list; ap = 0;
      } else if (item.type === 'forage') {
        title = '🌿 채집'; ap = 2;
      } else if (item.type === 'hunt') {
        const mob = MOBS.find(m => m.id === item.mobId);
        title = `🗡 ${mob?.icon || ''} ${mob?.name || ''} 사냥`; ap = 3;
      } else if (item.type === 'plant') {
        const seed = SEEDS.find(x => x.id === item.itemId);
        const animal = ANIMALS.find(x => x.id === item.itemId);
        const target = seed || animal;
        title = `🌱 심기 (슬롯 ${item.slotIdx + 1})`;
        detail = target ? `${target.icon} ${target.name}` : '';
        ap = 2;
      } else if (item.type === 'harvest') {
        title = `🌱 수확 (슬롯 ${item.slotIdx + 1})`; ap = 1;
      } else if (item.type === 'research') {
        const base = BASE_BREADS.find(b => b.name === item.baseName);
        title = '🔬 연구 시도';
        detail = `${base?.icon || '🥐'} ${item.baseName} + ${item.specialName}`;
        ap = 3;
      } else if (item.type === 'craft') {
        const recipe = CRAFT_RECIPES.find(r => r.id === item.recipeId);
        title = '🧿 공예';
        detail = recipe ? `${recipe.icon} ${recipe.name}` : '';
        ap = 2;
      } else if (item.type === 'acceptQuest') {
        const quest = QUESTS.find(q => q.id === item.questId);
        title = '📋 의뢰 수락';
        detail = quest ? quest.name : '';
        ap = 0;
      } else if (item.type === 'submitQuest') {
        const quest = currentState?.activeQuest ? QUESTS.find(q => q.id === currentState.activeQuest.id) : null;
        title = '📋 의뢰 제출';
        detail = quest ? quest.name : '';
        ap = 0;
      } else if (item.type === 'travel') {
        const travel = TRAVELS.find(t => t.id === item.travelId);
        title = '🎫 여행';
        detail = travel ? `${travel.icon} ${travel.name} (-${travel.price.toLocaleString()}G)` : '';
        ap = 0;
      } else if (item.type === 'endDay') {
        title = '☾ 하루 마감'; ap = 0;
      }
      const detailHtml = detail ? `<div class="cb-qitem-detail">${detail}</div>` : '';
      return `
        <div class="cb-qitem">
          <div class="cb-qitem-content">
            <div class="cb-qitem-title">${title} <span style="color:#6B7A6E;font-weight:400;">(AP ${ap})</span></div>
            ${detailHtml}
          </div>
          <button class="cb-qitem-x" data-qidx="${idx}">✕</button>
        </div>
      `;
    }).join('');
    return `
      <div class="cb-preview">
        <div class="cb-preview-label">✦ 지금 보낼 행동 ✦</div>
        <div class="cb-preview-list">${items}</div>
        <div class="cb-preview-ap ${apWarn}">합계 AP ${totalAP} / 잔여 ${currentState?.ap || 0}${apWarn ? ' ⚠' : ''}</div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════
  // 15. 즐겨찾기 유틸
  // ═══════════════════════════════════════════════════════════════

  function toggleFavorite(state, name) {
    const idx = state.favorites.indexOf(name);
    if (idx >= 0) {
      state.favorites.splice(idx, 1);
    } else {
      if (state.favorites.length >= FAVORITES_MAX) {
        alert(`즐겨찾기는 최대 ${FAVORITES_MAX}개까지`);
        return false;
      }
      state.favorites.push(name);
    }
    return true;
  }

  // ═══════════════════════════════════════════════════════════════
  // 16. Undo
  // ═══════════════════════════════════════════════════════════════

  async function undoLastTurn() {
    const state = await loadState();
    if (!state.previousSnapshot) {
      alert('되돌릴 수 있는 이전 턴이 없어');
      return false;
    }
    const restored = state.previousSnapshot;
    restored.previousSnapshot = null;
    await saveState(restored);
    currentState = restored;
    return true;
  }

  // ═══════════════════════════════════════════════════════════════
  // 17. 이벤트 바인딩
  // ═══════════════════════════════════════════════════════════════

  function bindCommonHandlers() {
    const root = document.getElementById('cb-root');
    root.querySelector('#cb-min').addEventListener('click', () => risuai.hideContainer());
    root.querySelector('#cb-close').addEventListener('click', () => risuai.hideContainer());
    root.querySelectorAll('.cb-sidetab').forEach(t => {
      t.addEventListener('click', () => {
        currentTab = t.dataset.tab;
        if (currentTab === 'activity') activitySub = 'main';
        renderUI();
      });
    });
    root.querySelectorAll('.cb-qitem-x').forEach(b => {
      b.addEventListener('click', () => {
        removeQueueItem(parseInt(b.dataset.qidx, 10));
        renderUI();
      });
    });
    // 아이템 이름 팝업 (v0.7.5)
    const tooltip = root.querySelector('#cb-item-tooltip');
    let tooltipTimer = null;
    root.querySelectorAll('.cb-item-tap').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = el.dataset.itemname;
        if (!name || !tooltip) return;
        tooltip.textContent = `${itemIcon(name)} ${name}`;
        tooltip.classList.add('show');
        if (tooltipTimer) clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => tooltip.classList.remove('show'), 1600);
      });
    });
  }

  function bindTabHandlers() {
    const root = document.getElementById('cb-root');

    // 활동 메인
    root.querySelectorAll('[data-act]').forEach(r => {
      r.addEventListener('click', () => {
        if (r.classList.contains('locked')) return;
        const id = r.dataset.act;
        if (['bake', 'sell', 'out', 'adv', 'garden', 'research', 'craft', 'quest', 'travel'].includes(id)) {
          activitySub = id;
          if (id === 'research') researchBaseName = null;
          renderUI();
        }
      });
    });

    // 외출/모험 하위
    root.querySelectorAll('[data-out]').forEach(r => {
      r.addEventListener('click', () => {
        if (r.dataset.out === 'shop') { activitySub = 'shop'; shopSub = 'buy'; renderUI(); }
      });
    });
    root.querySelectorAll('[data-adv]').forEach(r => {
      r.addEventListener('click', () => {
        if (r.dataset.adv === 'forage') { activitySub = 'forage'; renderUI(); }
        else if (r.dataset.adv === 'hunt') { activitySub = 'hunt'; renderUI(); }
      });
    });

    // 뒤로
    const backBtn = root.querySelector('#cb-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (activitySub === 'shop') activitySub = 'out';
        else if (activitySub === 'forage' || activitySub === 'hunt') activitySub = 'adv';
        else activitySub = 'main';
        renderUI();
      });
    }
    const backPlant = root.querySelector('#cb-back-plant');
    if (backPlant) {
      backPlant.addEventListener('click', () => { activitySub = 'garden'; renderUI(); });
    }
    const backResearch = root.querySelector('#cb-back-research');
    if (backResearch) {
      backResearch.addEventListener('click', () => {
        activitySub = 'research';
        researchBaseName = null;
        renderUI();
      });
    }

    // 제빵 - 필터
    root.querySelectorAll('[data-filter]').forEach(c => {
      c.addEventListener('click', () => { bakeFilter = c.dataset.filter; renderUI(); });
    });

    // 제빵 - 카드 클릭
    root.querySelectorAll('[data-recipe]').forEach(c => {
      c.addEventListener('click', (e) => {
        if (e.target.closest('[data-favtoggle]')) return;
        if (c.classList.contains('locked')) return;
        const recipeName = c.dataset.recipe;
        const recipe = RECIPES.find(r => r.name === recipeName);
        if (recipe?.freeform) {
          const name = prompt('만들 빵 이름을 입력해줘');
          if (!name || !name.trim()) return;
          addBake(name.trim());
        } else {
          const ok = addBake(recipeName);
          if (!ok) { alert(`한 세션 최대 ${BAKE_SESSION_MAX}개까지`); return; }
        }
        renderUI();
      });
    });

    // 즐겨찾기 토글
    root.querySelectorAll('[data-favtoggle]').forEach(b => {
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        const name = b.dataset.favtoggle;
        const ok = toggleFavorite(currentState, name);
        if (ok) {
          await saveState(currentState);
          renderUI();
        }
      });
    });

    // 즐겨찾기 슬롯 클릭 (제빵 큐 추가)
    root.querySelectorAll('[data-favbake]').forEach(c => {
      c.addEventListener('click', () => {
        const name = c.dataset.favbake;
        const ok = addBake(name);
        if (!ok) { alert(`한 세션 최대 ${BAKE_SESSION_MAX}개까지`); return; }
        renderUI();
      });
    });

    // 영업
    const sellBtn = root.querySelector('#cb-sell');
    if (sellBtn) sellBtn.addEventListener('click', () => { addSell(); renderUI(); });
    const dayEnd = root.querySelector('#cb-endday');
    if (dayEnd) dayEnd.addEventListener('click', () => { addEndDay(); renderUI(); });

    // 장보기
    root.querySelectorAll('[data-shopsub]').forEach(t => {
      t.addEventListener('click', () => { shopSub = t.dataset.shopsub; renderUI(); });
    });
    root.querySelectorAll('[data-buy]').forEach(c => {
      c.addEventListener('click', () => { addShop(c.dataset.buy); renderUI(); });
    });
    root.querySelectorAll('[data-sellmat]').forEach(c => {
      c.addEventListener('click', () => { addSellItem(c.dataset.sellmat); renderUI(); });
    });

    // 채집
    const forageBtn = root.querySelector('#cb-forage-btn');
    if (forageBtn) forageBtn.addEventListener('click', () => { addForage(); renderUI(); });

    // 사냥
    root.querySelectorAll('[data-mob]').forEach(c => {
      c.addEventListener('click', () => { addHunt(c.dataset.mob); renderUI(); });
    });

    // 정원
    root.querySelectorAll('[data-plant-slot]').forEach(c => {
      c.addEventListener('click', () => {
        plantTargetSlot = parseInt(c.dataset.plantSlot, 10);
        activitySub = 'plant';
        renderUI();
      });
    });
    root.querySelectorAll('[data-harvest-slot]').forEach(c => {
      c.addEventListener('click', () => {
        addHarvest(parseInt(c.dataset.harvestSlot, 10));
        renderUI();
      });
    });
    root.querySelectorAll('[data-plantid]').forEach(c => {
      c.addEventListener('click', () => {
        addPlant(plantTargetSlot, c.dataset.plantid);
        activitySub = 'garden';
        renderUI();
      });
    });

    // 연구
    root.querySelectorAll('[data-researchbase]').forEach(c => {
      c.addEventListener('click', () => {
        if (c.classList.contains('locked')) return;
        researchBaseName = c.dataset.researchbase;
        activitySub = 'researchSpecial';
        renderUI();
      });
    });
    root.querySelectorAll('[data-researchspecial]').forEach(c => {
      c.addEventListener('click', () => {
        if (c.classList.contains('locked')) return;
        addResearch(researchBaseName, c.dataset.researchspecial);
        activitySub = 'research';
        researchBaseName = null;
        renderUI();
      });
    });

    // 공예 (v0.7)
    root.querySelectorAll('[data-craft]').forEach(c => {
      c.addEventListener('click', () => {
        if (c.classList.contains('locked')) return;
        addCraft(c.dataset.craft);
        renderUI();
      });
    });

    // 의뢰 수락 (v0.7)
    root.querySelectorAll('[data-acceptquest]').forEach(c => {
      c.addEventListener('click', () => {
        if (currentState?.activeQuest) { alert('이미 진행 중인 의뢰가 있어'); return; }
        if (queue.find(i => i.type === 'acceptQuest')) { alert('이미 큐에 수락 대기 중'); return; }
        addAcceptQuest(c.dataset.acceptquest);
        renderUI();
      });
    });

    // 의뢰 제출 (v0.7)
    const submitBtn = root.querySelector('#cb-submit-quest');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (submitBtn.hasAttribute('disabled')) return;
        addSubmitQuest();
        renderUI();
      });
    }

    // 여행 (v0.7.3)
    root.querySelectorAll('[data-travel]').forEach(c => {
      c.addEventListener('click', () => {
        if (c.classList.contains('locked')) return;
        const travel = TRAVELS.find(t => t.id === c.dataset.travel);
        if (!travel) return;
        if (!confirm(`${travel.name}에 다녀올까?\n비용 ${travel.price.toLocaleString()}G가 소진돼.`)) return;
        addTravel(c.dataset.travel);
        renderUI();
      });
    });

    // 도감
    root.querySelectorAll('[data-codexsub]').forEach(t => {
      t.addEventListener('click', () => { codexSub = t.dataset.codexsub; renderUI(); });
    });

    // 편지 열기/닫기 (v0.7.1)
    const openLetter = root.querySelector('#cb-open-letter');
    if (openLetter) openLetter.addEventListener('click', () => { letterOpen = true; renderUI(); });
    const closeLetter = root.querySelector('#cb-close-letter');
    if (closeLetter) closeLetter.addEventListener('click', () => { letterOpen = false; renderUI(); });

    // 설정
    const undoBtn = root.querySelector('#cb-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', async () => {
        if (!confirm('직전 턴 상태로 되돌릴까?\n(현재 큐는 유지, state만 복구)')) return;
        const ok = await undoLastTurn();
        if (ok) {
          alert('직전 턴 상태로 되돌렸어');
          renderUI();
        }
      });
    }
    const clearBtn = root.querySelector('#cb-clear-queue');
    if (clearBtn) clearBtn.addEventListener('click', () => { clearQueue(); renderUI(); });
    const resetBtn = root.querySelector('#cb-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (!confirm('이 챗방 진행 데이터를 모두 초기화할까?')) return;
        await resetState();
        clearQueue();
        currentState = await loadState();
        currentTab = 'status';
        activitySub = 'main';
        renderUI();
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 18. 진입점
  // ═══════════════════════════════════════════════════════════════

  async function openBakery() {
    await risuai.showContainer('fullscreen');
    buildShell();
    currentState = await loadState();
    renderUI();
  }

  await risuai.registerButton(
    { name: 'Cozy-Leaf', icon: '🌿', iconType: 'html', location: 'chat', id: 'btn-cozy-bakery' },
    openBakery
  );
})();
