document.addEventListener('DOMContentLoaded', function() {
    // 獲取DOM元素
    const tutorialBtn = document.getElementById('tutorial-btn');
    const tutorialPopup = document.getElementById('tutorial-popup');
    const closeBtn = document.getElementById('close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentStepElement = document.getElementById('current-step');
    const progressBar = document.getElementById('progress-bar');
    const tutorialSteps = document.querySelectorAll('.tutorial-step');
    const popupBody = document.querySelector('.popup-body');
    const downloadLink = document.getElementById('download-manual');
    
    // 從localStorage獲取上次的步驟，如果沒有則默認為1
    let currentStep = parseInt(localStorage.getItem('tutorialStep')) || 1;
    const totalSteps = tutorialSteps.length;
    
    // 顯示教學彈跳視窗
    tutorialBtn.addEventListener('click', function() {
        tutorialPopup.classList.add('active');
        updateStepDisplay();
    });
    
    // 關閉教學彈跳視窗
    closeBtn.addEventListener('click', function() {
        // 保存當前步驟到localStorage
        localStorage.setItem('tutorialStep', currentStep);
        
        // 添加退場動畫
        tutorialPopup.style.opacity = '0';
        setTimeout(() => {
            tutorialPopup.classList.remove('active');
            tutorialPopup.style.opacity = '1';
        }, 300);
    });
    
    // 上一步按鈕
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
            addButtonFeedback(prevBtn);
        }
    });
    
    // 下一步按鈕
    nextBtn.addEventListener('click', function() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
            addButtonFeedback(nextBtn);
        }
    });
    
    // 添加按鈕反饋效果
    function addButtonFeedback(button) {
        button.classList.add('btn-active');
        setTimeout(() => {
            button.classList.remove('btn-active');
        }, 200);
    }
    
    // 更新步驟顯示
    function updateStepDisplay() {
        // 更新步驟指示器
        currentStepElement.textContent = currentStep;
        
        // 更新進度條
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // 隱藏所有步驟
        tutorialSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // 顯示當前步驟
        const activeStep = document.querySelector(`.tutorial-step[data-step="${currentStep}"]`);
        if (activeStep) {
            activeStep.classList.add('active');
        }
        
        // 更新按鈕狀態
        prevBtn.disabled = currentStep === 1;
        nextBtn.disabled = currentStep === totalSteps;
        
        // 保存當前步驟到localStorage
        localStorage.setItem('tutorialStep', currentStep);
    }
    
    // 初始化顯示
    updateStepDisplay();
    
    // 點擊彈跳視窗外部區域關閉視窗
    tutorialPopup.addEventListener('click', function(event) {
        if (event.target === tutorialPopup) {
            localStorage.setItem('tutorialStep', currentStep);
            tutorialPopup.classList.remove('active');
        }
    });
    
    // 鍵盤導航
    document.addEventListener('keydown', function(e) {
        if (tutorialPopup.classList.contains('active')) {
            if (e.key === 'ArrowRight' && currentStep < totalSteps) {
                currentStep++;
                updateStepDisplay();
            } else if (e.key === 'ArrowLeft' && currentStep > 1) {
                currentStep--;
                updateStepDisplay();
            } else if (e.key === 'Escape') {
                localStorage.setItem('tutorialStep', currentStep);
                tutorialPopup.classList.remove('active');
            }
        }
    });
    
    // 手勢導航 - 觸控滑動
    let touchStartX = 0;
    let touchEndX = 0;
    
    popupBody.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    popupBody.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50; // 滑動閾值
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // 向左滑動 - 下一步
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepDisplay();
            }
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // 向右滑動 - 上一步
            if (currentStep > 1) {
                currentStep--;
                updateStepDisplay();
            }
        }
    }
    
    // 下載操作手冊點擊事件
    if (downloadLink) {
        downloadLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 這裡只是前端示意，不實際下載文件
            // 在實際應用中，這裡會連接到真實的下載功能
            
            // 顯示下載提示
            const downloadFeedback = document.createElement('div');
            downloadFeedback.className = 'download-feedback';
            downloadFeedback.innerHTML = '<i class="fas fa-check-circle"></i> 操作手冊下載中...';
            
            document.body.appendChild(downloadFeedback);
            
            // 2秒後移除提示
            setTimeout(() => {
                downloadFeedback.classList.add('fade-out');
                setTimeout(() => {
                    document.body.removeChild(downloadFeedback);
                }, 500);
            }, 2000);
        });
    }
});