document.addEventListener('DOMContentLoaded', () => {
    const optionsInput = document.getElementById('options');
    const saveButton = document.getElementById('saveOptions');
    const drawButton = document.getElementById('draw');
    const fullscreenButton = document.getElementById('fullscreen');
    const configureButton = document.getElementById('configure');
    const resultDisplay = document.getElementById('result');
    const historyList = document.getElementById('history');
    const modal = document.getElementById('modal');
    const modalResult = document.getElementById('modal-result');
    const modalClose = document.getElementById('modal-close');

    const modalConfig = document.getElementById('modalConf');
    const confUpdateButton = document.getElementById('confUpdate');
    const confCancelButton = document.getElementById('confCancel');
    const confHistoryClearButton = document.getElementById('confHistoryClear');

    let options = [];
    let drawnItems = [];

    // LocalStorageからデータをロード
    const loadData = () => {
        const savedOptions = localStorage.getItem('bingoOptions');
        const savedDrawn = localStorage.getItem('bingoDrawn');
        if (savedOptions) {
            options = JSON.parse(savedOptions);
            optionsInput.value = options.join('\n');
        }
        if (savedDrawn) {
            drawnItems = JSON.parse(savedDrawn);
            updateHistory();
        }
    };

    // 選択肢リストを保存
    saveButton.addEventListener('click', () => {
        if (drawnItems.length > 0 && !confirm('選択肢リストを更新しますか？<br>抽選結果はクリアされます。')) {
            return;
        }
        options = optionsInput.value.split('\n').map(item => item.trim()).filter(item => item);
        localStorage.setItem('bingoOptions', JSON.stringify(options));
        alert('選択肢リストを保存しました！');
        clearHistory();
    });

    // 抽選処理
    drawButton.addEventListener('click', () => {
        if (options.length === drawnItems.length) {
            alert('すべての選択肢が抽選済みです！');
            return;
        }

        drawButton.disabled = true;
        resultDisplay.classList.add('spinning');
        resultDisplay.textContent = '抽選中...';

        let spinCount = 0;
        const spinInterval = setInterval(() => {
            const remainingOptions = options.filter(opt => !drawnItems.includes(opt));
            const randomItem = remainingOptions[Math.floor(Math.random() * remainingOptions.length)];
            resultDisplay.textContent = randomItem;
            spinCount++;
            if (spinCount > 10) {
                clearInterval(spinInterval);
                finishDraw(randomItem);
            }
        }, 100);
    });

    // 抽選終了処理
    const finishDraw = (item) => {
        drawnItems.push(item);
        localStorage.setItem('bingoDrawn', JSON.stringify(drawnItems));
        resultDisplay.classList.remove('spinning');
        resultDisplay.classList.add('pop');
        resultDisplay.textContent = item;
        updateHistory();
        drawButton.disabled = false;
        setTimeout(() => resultDisplay.classList.remove('pop'), 300);
    };

    // 履歴更新
    const updateHistory = () => {
        historyList.innerHTML = '';
        drawnItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            historyList.appendChild(li);
        });
    };

    // 履歴削除
    const clearHistory = () => {
        localStorage.removeItem('bingoDrawn');
        drawnItems = [];
        updateHistory();
    }

    const closeConfig = () => {
        modalConfig.style.display = 'none';
    }

    // 全画面表示
    fullscreenButton.addEventListener('click', () => {
        if (drawnItems.length > 0) {
            modalResult.textContent = drawnItems[drawnItems.length - 1];
            modal.style.display = 'flex';
        }
    });

    // モーダル閉じる
    modal.addEventListener('click', (event) => {
        const modalContent = event.target.getElementsByClassName('modal-content')[0];

        // クリックされた要素がモーダルコンテンツの外側かどうかを判定
        if (!modalContent.contains(event.target)) {
            modal.style.display = 'none';
        }
    });
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 設定画面開く
    configureButton.addEventListener('click', () => {
        optionsInput.value = options.join('\n');
        modalConfig.style.display = 'flex';
    });
    modalConfig.addEventListener('click', (event) => {
        const modalContent = event.target.getElementsByClassName('modal-content')[0];

        // クリックされた要素がモーダルコンテンツの外側かどうかを判定
        if (!modalContent.contains(event.target)) {
            closeConfig();
        }
    });

    // confUpdateButton.addEventListener('click', () => {
    //     closeConfig();
    // });

    confCancelButton.addEventListener('click', () => {
        closeConfig();
    });

    confHistoryClearButton.addEventListener('click', () => {
        if (confirm('ビンゴの結果リストを削除しますか？')) {
            clearHistory();
        }
    });

    // 選択肢リスト削除ボタンの追加とロジック
    const clearOptionsButton = document.createElement('button');
    clearOptionsButton.id = 'clearOptions';
    clearOptionsButton.textContent = 'リスト削除';
    const optionsSection = document.querySelector('.options-section');
    optionsSection.appendChild(clearOptionsButton);

    clearOptionsButton.addEventListener('click', () => {
        if (confirm('選択肢リストを削除しますか？')) {
            optionsInput.value = '';
            options = [];
            localStorage.removeItem('bingoOptions');
            alert('選択肢リストを削除しました。');
            clearHistory();
        }
    });

    // 初期化
    loadData();
});
