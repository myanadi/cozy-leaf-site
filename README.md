<div align="center">

# 🌿 Cozy-Leaf · 포근잎 베이커리

**포근잎 마을의 마녀 제빵사 — RisuAI 힐링 베이커리 생활 시뮬레이션**

[🎮 사이트 방문 / Visit Site](https://myanadi.github.io/cozy-leaf-site/)

</div>

---

## 🇰🇷 한국어

### 소개

낡은 화덕에 다시 불을 지피는, 초보 마녀 제빵사의 이야기.
빵을 굽고, 숲을 거닐고, 이웃과 교감하며 할머니가 남긴 흩어진 조각을 모아가세요.

**Cozy-Leaf**는 RisuAI에서 동작하는 플러그인 게임입니다. 플러그인이 게임 데이터(행동력·골드·명성·스킬·인벤토리)를 계산하고, AI가 그 위에 따뜻한 서사를 그려냅니다.

### 구성 파일

| 파일 | 설명 |
|------|------|
| `plugin/cozy_leaf.js` | 게임 플러그인 본체 |
| `character-card/cozy_leaf_prompt.md` | 캐릭터 시트용 프롬프트 |
| `index.html` | 소개 사이트 |

### 설치 방법

1. **플러그인 설치** — RisuAI 설정 → 플러그인 → `cozy_leaf.js` 코드를 붙여넣기
2. **캐릭터 시트 설정** — `cozy_leaf_prompt.md`의 내용을 캐릭터 카드 프롬프트에 적용
3. 채팅방 햄버거 메뉴를 열면 **🌿Cozy-Leaf** 창이 나타납니다

### 게임 방법

- **플러그인은 플러그인 내에서 지시한 활동만 계산합니다.** 플러그인 밖의 인풋으로 물건을 팔거나 돈을 얻어도 데이터에 반영되지 않아요.
- 제빵·모험·외출·정원 등 여러 활동이 가능하며, 각 활동은 **AP(행동력)**를 소모합니다. 하루 10칸을 자유롭게 배분하세요.
- 활동은 플러그인 위쪽 **큐(대기함)**에 담기고, 인풋과 함께 전송됩니다. 원하는 활동을 담고 → 창을 닫고 → 메시지를 보내면 됩니다.
- AI 응답을 리롤할 땐, **설정 → 직전 턴 되돌리기**로 마지막 큐 결과를 취소하세요. (반복해서 눌러도 그 이전 큐는 되돌아가지 않습니다.)

### 업데이트

플러그인 코드만 새로 붙여넣기 하면 **진행 상황은 그대로 유지**됩니다.
세이브 데이터는 채팅방별로 저장되며, 코드 교체와 무관하게 보존됩니다.

## 저작권 / Copyright

Copyright (c) 2026 myanadi. All Rights Reserved.

이 프로젝트의 모든 권리는 제작자에게 있습니다.
무단 복제, 재배포, 수정, 판매를 금합니다.
개인적인 플레이 용도로만 사용해 주세요.

All rights reserved. Unauthorized copying, redistribution,
modification, or sale is prohibited. For personal play only.


---

## 🇬🇧 English

### About

The story of a novice witch baker relighting a long-cold oven.
Bake bread, wander the forest, bond with neighbors, and gather the scattered fragments your grandmother left behind.

**Cozy-Leaf** is a plugin game for RisuAI. The plugin handles all game data (action points, gold, reputation, skills, inventory) while the AI weaves a warm narrative on top of it.

### Files

| File | Description |
|------|-------------|
| `plugin/cozy_leaf.js` | The game plugin |
| `character-card/cozy_leaf_prompt.md` | Prompt for the character card |
| `index.html` | Landing site |

### Installation

1. **Install the plugin** — RisuAI Settings → Plugins → paste the `cozy_leaf.js` code
2. **Set up the character card** — Apply the contents of `cozy_leaf_prompt.md` to your character card prompt
3. Open the hamburger menu in a chat to find the **🌿Cozy-Leaf** window

### How to Play

- **The plugin only counts activities issued within the plugin.** Selling items or earning money through input outside the plugin will not affect the data.
- Various activities are available (baking, adventuring, errands, gardening, etc.), each consuming **AP (Action Points)**. Freely distribute your 10 daily points.
- Activities are added to a **queue** at the top of the plugin and sent along with your input. Add activities → close the window → send your message.
- To reroll an AI response, use **Settings → Undo Last Turn** to cancel the last queue result. (Repeating this does not undo queues before the last one.)

### Updates

Simply paste the new plugin code to update — **your progress is preserved**.
Save data is stored per chat and remains intact regardless of code replacement.

---

<div align="center">

Made with 🌿 for the RisuAI community

*An original cozy life-sim, brewed with love for slow days and warm bread.*

</div>
