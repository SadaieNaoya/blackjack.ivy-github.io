// DOM要素の取得
const playButton = document.getElementById('playButton'); // プレイボタン
const title = document.getElementById('title'); // タイトル
const video = document.getElementById('loadingVideo'); // ローディング動画
const dealerSumDisplay = document.getElementById('dealerSumDisplay'); // ディーラーの合計表示
const playerSumDisplay = document.getElementById('playerSumDisplay'); // プレイヤーの合計表示
const gameInfo = document.getElementById('gameInfo'); // ゲーム情報エリア
const gameControls = document.getElementById('gameControls'); // ゲーム操作エリア
const hitButton = document.getElementById('hitButton'); // HITボタン
const standButton = document.getElementById('standButton'); // STANDボタン
const resultDisplay = document.getElementById('resultDisplay'); // 結果表示エリア
const resultMessage = document.getElementById('resultMessage'); // 結果メッセージ
const resetButton = document.getElementById('resetButton'); // リセットボタン

// サウンド設定
const drawSound = new Audio('img/doro.mp3'); // カードを引く音
const mainSound = new Audio('img/main.mp3'); // ゲームBGM
mainSound.loop = true; // BGMをループ再生

// ゲームの状態を管理する変数
let playerSUM = 0; // プレイヤーの合計
let dealerSUM = 0; // ディーラーの合計
let deck = Array.from({ length: 54 }, (_, i) => i + 1); // デッキの初期化
let playerStand = false; // プレイヤーがSTANDしたか
let dealerStand = false; // ディーラーがSTANDしたか
let playerTurn = true; // プレイヤーのターンか

// カードを引く関数
function drawCard() {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(randomIndex, 1)[0];
    let cardValue = card % 13 || 13; // カードの値を1-13の範囲にする
    return cardValue === 1 ? 11 : Math.min(cardValue, 10); // エースは11、それ以外は最大10
}

// カードを引いた時のサウンド再生関数
function playDrawSound() {
    drawSound.currentTime = 0;
    drawSound.play();
}

// ゲーム開始ボタンのクリックイベント
playButton.addEventListener('click', function () {
    playButton.style.display = 'none'; // プレイボタンを非表示
    title.style.display = 'none'; // タイトルを非表示
    video.style.display = 'block'; // ローディング動画を表示
    mainSound.currentTime = 0;
    mainSound.play(); // BGM再生
    video.play();
});

// ローディング動画が終了した時の処理
video.onended = function () {
    video.style.display = 'none'; // 動画を非表示
    gameInfo.style.display = 'flex'; // ゲーム情報を表示
    gameControls.style.display = 'flex'; // ゲーム操作を表示
    dealerSUM = drawCard(); // ディーラー初期カード
    playerSUM = drawCard(); // プレイヤー初期カード
    
    // モバイル画面向けの調整
    if (window.innerWidth <= 480) {
        dealerSumDisplay.style.position = 'static';
        playerSumDisplay.style.position = 'static';
        gameInfo.style.flexDirection = 'column';
        gameInfo.style.alignItems = 'center';
    }
    
    dealerSumDisplay.textContent = `ディーラー: ${dealerSUM}`; // 初期ディーラー表示
    playerSumDisplay.textContent = `プレイヤー: ${playerSUM}`; // 初期プレイヤー表示
};

// HITボタンの処理
hitButton.addEventListener('click', function () {
    if (playerTurn && !playerStand) { // プレイヤーのターンかつSTANDしていない場合
        playDrawSound();
        playerSUM += drawCard(); // カードを引く
        playerSumDisplay.textContent = `プレイヤー: ${playerSUM}`;
        if (checkGameOver()) return; // 勝敗判定
        playerTurn = false;
        dealerTurn(); // ディーラーのターン
    }
});

// STANDボタンの処理
standButton.addEventListener('click', function () {
    playerStand = true; // プレイヤーがSTAND
    playerTurn = false;
    dealerTurn(); // ディーラーのターン
});

// ディーラーの行動ロジック
function dealerTurn() {
    setTimeout(() => {
        if (!dealerStand) { // ディーラーがSTANDしていない場合
            if ((dealerSUM < playerSUM && dealerSUM < 22) || dealerSUM <= 15) {
                playDrawSound();
                dealerSUM += drawCard();
                dealerSumDisplay.textContent = `ディーラー: ${dealerSUM}`;
            } else {
                dealerStand = true;
            }
        }
        if (checkGameOver()) return;
        if (!playerStand) playerTurn = true; // プレイヤーのターンに戻す
    }, 1000); // 1秒後に実行
}

// 勝敗判定関数
function checkGameOver() {
    if (playerSUM >= 22 || dealerSUM >= 22) { // 22を超えた場合
        resultDisplay.style.display = 'flex';
        if (playerSUM >= 22) {
            resultMessage.textContent = "ディーラーの勝利です";
        } else {
            resultMessage.textContent = "あなたの勝利です";
        }
        return true;
    } else if (playerStand && dealerStand) { // 両者がSTANDした場合
        resultDisplay.style.display = 'flex';
        if (dealerSUM > playerSUM || dealerSUM === playerSUM) {
            resultMessage.textContent = "ディーラーの勝利です";
        } else {
            resultMessage.textContent = "あなたの勝利です";
        }
        return true;
    }
    return false;
}

// リセットボタンの処理
resetButton.addEventListener('click', function () {
    deck = Array.from({ length: 54 }, (_, i) => i + 1); // デッキのリセット
    playerSUM = 0;
    dealerSUM = drawCard(); // ディーラー初期カード
    playerStand = false;
    dealerStand = false;
    playerTurn = true;
    resultDisplay.style.display = 'none';
    dealerSumDisplay.textContent = `ディーラー: ${dealerSUM}`;
    playerSumDisplay.textContent = `プレイヤー: ${playerSUM}`;
});

// タイトルアニメーション処理
const target = window.document.getElementsByTagName('h1')[0];
const flickerLetter = letter => `<span style="animation: flicker-${Math.random()*4+1}s infinite">${letter}</span>`;
const colorLetter = letter => `<span style="color: hsl(${Math.random()*360}, 100%, 80%)">${letter}</span>`;
const flickerAndColorText = text =>
    text
        .split('')
        .map(flickerLetter)
        .map(colorLetter)
        .join('');
const neonGlory = target => target.innerHTML = flickerAndColorText(target.textContent);
neonGlory(target);
target.onclick = ({ target }) => neonGlory(target);
