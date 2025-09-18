// DOM読み込み完了時の処理
document.addEventListener('DOMContentLoaded', function() {
    // ローディング画面の制御
    const loadingScreen = document.getElementById('loading-screen');
    const loadingPercentage = document.querySelector('.loading-percentage');
    
    // セッションストレージをチェックして初回訪問かどうか確認
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
        // 2回目以降の訪問はローディング画面をスキップ
        loadingScreen.style.display = 'none';
        startHeroAnimations();
    } else {
        // 初回訪問時はローディングアニメーションを実行
        sessionStorage.setItem('hasVisited', 'true');
        
        // プログレス表示
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            loadingPercentage.textContent = Math.floor(progress) + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        startHeroAnimations();
                    }, 800);
                }, 500);
            }
        }, 100);
    }

    // ヒーローアニメーション開始
    function startHeroAnimations() {
        // 統計数値のカウントアニメーション
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateCounter(stat, target, 2000);
        });

        // タイピングエフェクト
        const typingText = document.querySelector('.typing-text');
        const originalText = typingText.textContent;
        typingText.textContent = '';
        typeWriter(typingText, originalText, 100);

        // パーティクルシステム初期化
        initParticles();
    }

    // ナビゲーションの制御
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // スクロール時のナビゲーション背景変更
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ハンバーガーメニューの制御
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // ハンバーガーアイコンのアニメーション
        const spans = hamburger.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // スムーススクロール
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // モバイルメニューを閉じる
                navMenu.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    });

    // スクロールアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // アニメーション対象要素の監視
    const animateElements = document.querySelectorAll('.service-card, .news-item, .company-item, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // カードホバーエフェクト
    const serviceCardsForHover = document.querySelectorAll('.service-card');
    serviceCardsForHover.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // パララックス効果
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground && scrolled < window.innerHeight) {
            heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        }

        // 浮遊する数字のパララックス
        const floatingNumbers = document.querySelectorAll('.floating-numbers .number');
        floatingNumbers.forEach((number, index) => {
            const speed = 0.1 + (index * 0.05);
            number.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // フォーム送信処理
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // 簡単なバリデーション
            if (!name || !email || !message) {
                showNotification('すべての項目を入力してください。', 'error');
                return;
            }
            
            // 送信アニメーション
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '送信中...';
            submitBtn.disabled = true;
            
            // 実際の送信処理（ここではシミュレーション）
            setTimeout(() => {
                showNotification('お問い合わせありがとうございます。後日ご連絡いたします。', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // リスク警告モーダル
    const modal = document.getElementById('risk-modal');
    const closeModal = document.querySelector('.close');
    
    // サービスリンククリック時の処理
    const serviceLinks = document.querySelectorAll('.service-link');
    serviceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 外部URLを持つリンクは新規タブで開く（モーダル表示しない）
            if (link.href && link.href !== '#' && !link.href.startsWith('#')) {
                // 外部リンクの場合は通常のリンク動作を許可
                return;
            }
            
            // 内部リンクや#リンクの場合はモーダル表示
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // 株式投資のサービスカード全体をクリック可能にする（NEKO ADVISORIES STOCK MEMBERS、鶴の一声のみ）
    const stockServiceCards = document.querySelectorAll('.service-category .service-card');
    stockServiceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // 既にリンクがクリックされた場合は何もしない
            if (e.target.tagName === 'A') {
                return;
            }
            
            // カード内のサービスリンクを探す
            const serviceLink = card.querySelector('.service-link');
            if (serviceLink && serviceLink.href && serviceLink.href !== '#' && !serviceLink.href.startsWith('#')) {
                // 外部URLの場合は新規タブで開く
                window.open(serviceLink.href, '_blank');
            }
        });
        
        // カードにホバー効果を追加（カーソルをポインターに変更）
        card.style.cursor = 'pointer';
    });
    
    // モーダルを閉じる
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // モーダル外クリックで閉じる
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 数値カウントアニメーション
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // タイピングエフェクト
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // パーティクルシステム
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 50;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 3 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220, 38, 38, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // パーティクル生成
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // アニメーションループ
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // パーティクル間の線を描画
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(220, 38, 38, ${0.1 * (1 - distance / 100)})`;
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // ウィンドウリサイズ対応
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // 通知システム
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 金融チャットボットボタン
    const chatBotBtn = document.createElement('button');
    chatBotBtn.innerHTML = '💬';
    chatBotBtn.className = 'chat-bot-btn';
    chatBotBtn.title = '金融アドバイザーAI';
    document.body.appendChild(chatBotBtn);
    
    // チャットボットウィンドウの作成
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.innerHTML = `
        <div class="chat-header">
            <h4>金融アドバイザーAI</h4>
            <button class="chat-close">×</button>
        </div>
        <div class="chat-messages" id="chat-messages">
            <div class="bot-message">
                <div class="message-content">
                    こんにちは！金融に関するご質問にお答えします。投資、資産運用、市場動向など、お気軽にお聞きください。
                </div>
            </div>
        </div>
        <div class="chat-input-container">
            <input type="text" class="chat-input" placeholder="金融に関する質問を入力してください..." maxlength="200">
            <button class="chat-send">送信</button>
        </div>
    `;
    document.body.appendChild(chatWindow);
    
    // チャットウィンドウ全体でのスクロール伝播を完全に防ぐ
    chatWindow.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    // チャットヘッダーでのスクロール伝播を防ぐ
    const chatHeader = chatWindow.querySelector('.chat-header');
    chatHeader.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    // チャット入力エリアでのスクロール伝播を防ぐ
    const chatInputContainer = chatWindow.querySelector('.chat-input-container');
    chatInputContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    // チャットメッセージエリアでのスクロール制御（メッセージエリア内のスクロールは許可）
    const chatMessages = chatWindow.querySelector('#chat-messages');
    chatMessages.addEventListener('wheel', (e) => {
        const { scrollTop, scrollHeight, clientHeight } = chatMessages;
        
        // メッセージエリア内でスクロール可能な場合は通常のスクロールを許可
        if (scrollHeight > clientHeight) {
            // 上端または下端に達した場合のみメインページへの伝播を防ぐ
            if ((e.deltaY < 0 && scrollTop === 0) || 
                (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight)) {
                e.preventDefault();
            }
        } else {
            // スクロール不要な場合は完全に防ぐ
            e.preventDefault();
        }
        e.stopPropagation();
    }, { passive: false });
    
    // チャットボット機能
    let chatOpen = false;
    
    // チャットボタンクリック
    chatBotBtn.addEventListener('click', () => {
        chatOpen = !chatOpen;
        if (chatOpen) {
            chatWindow.style.display = 'block';
            setTimeout(() => {
                chatWindow.classList.add('active');
            }, 10);
        } else {
            chatWindow.classList.remove('active');
            setTimeout(() => {
                chatWindow.style.display = 'none';
            }, 300);
        }
    });
    
    // チャット閉じるボタン
    const chatCloseBtn = chatWindow.querySelector('.chat-close');
    chatCloseBtn.addEventListener('click', () => {
        chatOpen = false;
        chatWindow.classList.remove('active');
        setTimeout(() => {
            chatWindow.style.display = 'none';
        }, 300);
    });
    
    // チャット送信機能
    const chatInput = chatWindow.querySelector('.chat-input');
    const chatSend = chatWindow.querySelector('.chat-send');
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // ユーザーメッセージを追加
        addMessage(message, 'user');
        chatInput.value = '';
        
        // ボット応答をシミュレート
        setTimeout(() => {
            const botResponse = generateBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1000);
    }
    
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // メッセージ追加関数
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${text}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // ボット応答生成
    function generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        console.log('ユーザーメッセージ:', userMessage);
        console.log('小文字変換後:', message);
        
        // 投資・株式関連
        if (message.includes('投資') || message.includes('株式') || message.includes('株') || 
            message.includes('銘柄') || message.includes('証券') || message.includes('売買') ||
            message.includes('買い') || message.includes('売り') || message.includes('保有') ||
            message.includes('ポートフォリオ') || message.includes('資産運用') || message.includes('運用')) {
            const responses = [
                '投資に関してですね。株式投資は長期的な視点が重要です。分散投資を心がけ、リスク管理を徹底することをお勧めします。当社のNEKO ADVISORIES STOCK MEMBERSサービスもご検討ください。',
                '株式投資についてお答えします。市場分析と銘柄選定が成功の鍵となります。当社では個別銘柄の配信サービスを提供しており、これまでストップ高を31本予想した実績があります。',
                '資産運用は計画的に行うことが大切です。リスク許容度に応じた投資戦略を立て、定期的な見直しを行いましょう。詳しくは当社の投資助言サービスをご利用ください。'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // FX・為替関連
        else if (message.includes('fx') || message.includes('為替') || message.includes('ドル') || 
                 message.includes('円') || message.includes('ユーロ') || message.includes('通貨') ||
                 message.includes('レート') || message.includes('スプレッド') || message.includes('レバレッジ')) {
            const responses = [
                'FX取引についてですね。為替市場は24時間動いており、高いリスクを伴います。当社のNana\'s CATSサービスでは、テクニカル分析を活用した戦略をご提供しています。',
                '為替相場は経済指標や政治情勢に大きく影響されます。リスク管理を徹底し、適切なレバレッジでの取引を心がけてください。',
                '通貨ペアの選択は重要です。主要通貨ペアから始めて、徐々に経験を積むことをお勧めします。当社のFXサービスでサポートいたします。'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // リスク・損失関連
        else if (message.includes('リスク') || message.includes('危険') || message.includes('損失') ||
                 message.includes('元本割れ') || message.includes('暴落') || message.includes('下落') ||
                 message.includes('安全') || message.includes('保証')) {
            return 'リスク管理は投資の基本中の基本です。投資には必ず元本割れのリスクが伴います。ご自身のリスク許容度を正しく把握し、余裕資金での投資を心がけてください。分散投資やストップロスの設定も重要です。';
        }
        
        // 初心者・学習関連
        else if (message.includes('初心者') || message.includes('始め') || message.includes('はじめ') ||
                 message.includes('新人') || message.includes('勉強') || message.includes('学習') ||
                 message.includes('わからない') || message.includes('教え') || message.includes('覚え')) {
            return '投資初心者の方ですね。まずは金融リテラシーの向上から始めることをお勧めします。少額から始めて、徐々に経験を積んでいくことが大切です。当社では初心者向けの丁寧なサポートも行っております。';
        }
        
        // サービス・料金関連
        else if (message.includes('サービス') || message.includes('料金') || message.includes('価格') ||
                 message.includes('費用') || message.includes('プラン') || message.includes('コース') ||
                 message.includes('neko') || message.includes('鶴の一声') || message.includes('nana')) {
            return '当社では株式投資向けの「NEKO ADVISORIES STOCK MEMBERS」「鶴の一声」、FX向けの「Nana\'s CATS」などのサービスを提供しています。各サービスの詳細や料金については、サービス一覧ページをご確認いただくか、お問い合わせください。';
        }
        
        // 会社・信頼性関連
        else if (message.includes('会社') || message.includes('企業') || message.includes('登録') ||
                 message.includes('免許') || message.includes('信頼') || message.includes('実績') ||
                 message.includes('歴史') || message.includes('設立') || message.includes('財務局')) {
            return '当社は関東財務局長（金商）第2289号の登録を受けた正式な投資助言業者です。2005年設立で20年の実績があり、一般社団法人日本投資顧問業協会の会員でもあります。これまでストップ高31本の予想実績もございます。';
        }
        
        // 市場・経済関連
        else if (message.includes('市場') || message.includes('相場') || message.includes('経済') ||
                 message.includes('日経') || message.includes('topix') || message.includes('指数') ||
                 message.includes('景気') || message.includes('インフレ') || message.includes('金利')) {
            return '市場動向の分析は投資判断の重要な要素です。日経平均やTOPIXなどの指数、経済指標、金利動向などを総合的に判断することが大切です。当社では市場分析レポートも提供しております。';
        }
        
        // 分析・手法関連
        else if (message.includes('分析') || message.includes('テクニカル') || message.includes('ファンダメンタル') ||
                 message.includes('チャート') || message.includes('指標') || message.includes('手法') ||
                 message.includes('戦略') || message.includes('予想') || message.includes('見通し')) {
            return 'テクニカル分析とファンダメンタル分析の両方を活用することが重要です。チャートパターンや各種指標を読み解き、企業の財務状況や業界動向も考慮した総合的な判断が必要です。当社の専門家がサポートいたします。';
        }
        
        // 税金・制度関連
        else if (message.includes('税金') || message.includes('税') || message.includes('確定申告') ||
                 message.includes('nisa') || message.includes('ニーサ') || message.includes('iDeCo') ||
                 message.includes('制度') || message.includes('優遇') || message.includes('控除')) {
            return '投資における税制は複雑ですが、NISA制度やiDeCoなどの優遇制度を活用することで税負担を軽減できます。確定申告の際は適切な処理が必要です。詳細は税理士や当社にご相談ください。';
        }
        
        // 挨拶・一般的な質問
        else if (message.includes('こんにちは') || message.includes('はじめまして') ||
                 message.includes('よろしく') || message.includes('ありがとう') ||
                 message.includes('お疲れ') || message.includes('おはよう') || message.includes('こんばんは')) {
            return 'こんにちは！日本投資助言株式会社の金融アドバイザーAIです。投資、資産運用、市場動向など、金融に関するご質問でしたら何でもお聞きください。お気軽にご相談ください！';
        }
        
        // 質問形式の対応
        else if (message.includes('？') || message.includes('?') || message.includes('どう') ||
                 message.includes('なに') || message.includes('何') || message.includes('いつ') ||
                 message.includes('どこ') || message.includes('だれ') || message.includes('誰') ||
                 message.includes('なぜ') || message.includes('どのよう')) {
            return 'ご質問ありがとうございます。より具体的な内容をお聞かせいただければ、詳しくお答えできます。投資、FX、リスク管理、市場分析など、どのような分野についてお知りになりたいでしょうか？';
        }
        
        // 金融一般
        else if (message.includes('金融') || message.includes('お金') || message.includes('資金') ||
                 message.includes('資産') || message.includes('財産') || message.includes('貯金') ||
                 message.includes('預金') || message.includes('銀行') || message.includes('金利')) {
            return '金融リテラシーの向上は現代において非常に重要です。預金だけでなく、適切な投資による資産形成を検討されることをお勧めします。当社では皆様の金融知識向上をサポートしております。';
        }
        
        // その他・デフォルト
        else {
            const defaultResponses = [
                'ご質問ありがとうございます。より詳しいご相談については、お電話（03-6555-3701）またはメール（support@japan-ia.co.jp）でお気軽にお問い合わせください。',
                '申し訳ございませんが、より具体的な金融・投資に関するご質問をいただけますでしょうか？株式投資、FX、リスク管理など、どのような分野についてお聞きになりたいですか？',
                '当社は金融リテラシーの向上をサポートしております。投資や資産運用について、お気軽にご質問ください。専門的なアドバイスが必要でしたら、直接お問い合わせいただくことも可能です。'
            ];
            console.log('デフォルト応答を返します');
            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
    }

    // 入力フィールドのフォーカスエフェクト
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            input.style.borderColor = 'var(--primary-color)';
        });
        
        input.addEventListener('blur', () => {
            input.style.boxShadow = 'none';
            input.style.borderColor = 'var(--border-color)';
        });
    });

    // GMO APIから為替データを取得
    // 前日比計算用のデータを保存（前日終値を取得して保存）
    let previousDayCloseRates = {
        'USD_JPY': null, // 前日終値（APIから取得）
        'EUR_JPY': null, // 前日終値（APIから取得）
        'BTC': null      // Bitcoin前日終値（APIから取得）
    };
    
    // 前日の日付を取得（YYYYMMDD形式）
    function getPreviousDate() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().slice(0, 10).replace(/-/g, '');
    }

    // 前日終値を取得する関数
    async function fetchPreviousDayClose(symbol) {
        try {
            const previousDate = getPreviousDate();
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            
            // Bitcoinと為替で異なるエンドポイントを使用
            let targetUrl;
            if (symbol === 'BTC') {
                targetUrl = `https://api.coin.z.com/public/v1/klines?symbol=${symbol}&interval=1min&date=${previousDate}`;
            } else {
                targetUrl = `https://forex-api.coin.z.com/public/v1/klines?symbol=${symbol}&priceType=ASK&interval=1min&date=${previousDate}`;
            }
            
            const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 0 && data.data && data.data.length > 0) {
                // 最後のデータ（終値）を取得
                const lastKline = data.data[data.data.length - 1];
                return parseFloat(lastKline.close);
            }
        } catch (error) {
            console.error(`Previous day close fetch error for ${symbol}:`, error);
        }
        return null;
    }

    // Bitcoinの現在レートを取得する関数
    async function fetchBitcoinData() {
        try {
            // 前日終値を取得（初回のみ）
            if (!previousDayCloseRates.BTC) {
                previousDayCloseRates.BTC = await fetchPreviousDayClose('BTC');
            }

            // CORS問題を回避するため、CORS proxyを使用
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const targetUrl = 'https://api.coin.z.com/public/v1/ticker?symbol=BTC';
            const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 0 && data.data && data.data.length > 0) {
                const btcData = data.data[0];
                const currentPrice = parseFloat(btcData.last);
                const previousClose = previousDayCloseRates.BTC;
                
                if (previousClose) {
                    updateBitcoinDisplay(currentPrice, previousClose);
                }
                console.log('Bitcoin API: Data updated successfully');
            } else {
                console.warn('Bitcoin API: Invalid response format', data);
            }
        } catch (error) {
            console.error('Bitcoin API fetch error:', error);
            showBitcoinApiError();
        }
    }

    // 現在の為替レートと前日終値を取得
    async function fetchForexData() {
        try {
            // 前日終値を取得（初回のみ）
            if (!previousDayCloseRates.USD_JPY) {
                previousDayCloseRates.USD_JPY = await fetchPreviousDayClose('USD_JPY');
            }
            if (!previousDayCloseRates.EUR_JPY) {
                previousDayCloseRates.EUR_JPY = await fetchPreviousDayClose('EUR_JPY');
            }

            // CORS問題を回避するため、CORS proxyを使用
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const targetUrl = 'https://forex-api.coin.z.com/public/v1/ticker';
            const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 0 && data.data) {
                updateForexRates(data.data);
                console.log('GMO API: Data updated successfully');
            } else {
                console.warn('GMO API: Invalid response format', data);
            }
        } catch (error) {
            console.error('GMO API fetch error:', error);
            // エラー時は前回のデータを維持し、フォールバック値を表示
            showApiError();
        }
    }

    function showApiError() {
        // API取得に失敗した場合の表示
        const usdJpyElement = document.getElementById('usd-jpy-price');
        const eurJpyElement = document.getElementById('eur-jpy-price');
        
        if (usdJpyElement && !usdJpyElement.dataset.errorShown) {
            usdJpyElement.innerHTML = '情報取得中... <small style="color: #fbbf24;">-</small>';
            usdJpyElement.dataset.errorShown = 'true';
        }
        
        if (eurJpyElement && !eurJpyElement.dataset.errorShown) {
            eurJpyElement.innerHTML = '情報取得中... <small style="color: #fbbf24;">-</small>';
            eurJpyElement.dataset.errorShown = 'true';
        }
    }

    function showBitcoinApiError() {
        // Bitcoin API取得に失敗した場合の表示
        const btcElement = document.getElementById('btc-price');
        
        if (btcElement && !btcElement.dataset.errorShown) {
            btcElement.innerHTML = '情報取得中... <small style="color: #fbbf24;">-</small>';
            btcElement.dataset.errorShown = 'true';
        }
    }

    function updateForexRates(forexData) {
        forexData.forEach(rate => {
            const symbol = rate.symbol;
            const currentAsk = parseFloat(rate.ask);
            const currentBid = parseFloat(rate.bid);
            
            if (symbol === 'USD_JPY') {
                // 前日終値との比較で前日比を計算
                const previousClose = previousDayCloseRates.USD_JPY;
                if (previousClose) {
                    updateRateDisplay('usd-jpy', currentAsk, previousClose);
                }
            } else if (symbol === 'EUR_JPY') {
                // 前日終値との比較で前日比を計算
                const previousClose = previousDayCloseRates.EUR_JPY;
                if (previousClose) {
                    updateRateDisplay('eur-jpy', currentAsk, previousClose);
                }
            }
        });
    }

    function updateRateDisplay(currencyId, currentRate, previousCloseRate) {
        const priceElement = document.getElementById(`${currencyId}-price`);
        
        if (priceElement) {
            // 前日終値との差分を計算（前日比）
            const change = currentRate - previousCloseRate;
            
            // 価格を更新（小数点以下3桁で表示）
            priceElement.innerHTML = `${currentRate.toFixed(3)} <small id="${currencyId}-change">${change >= 0 ? '+' : ''}${change.toFixed(3)}</small>`;
            
            // 変更量を更新（前日比）
            const changeElement = document.getElementById(`${currencyId}-change`);
            if (changeElement) {
                changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(3)}`;
            }
            
            // 色を更新（アニメーション効果付き）
            priceElement.style.transition = 'color 0.3s ease';
            if (change > 0) {
                priceElement.className = 'price up'; // 前日比で上昇
            } else if (change < 0) {
                priceElement.className = 'price down'; // 前日比で下落
            } else {
                priceElement.className = 'price'; // 前日比で変化なし
            }
            
            // エラー表示フラグをリセット
            if (priceElement.dataset.errorShown) {
                delete priceElement.dataset.errorShown;
            }
        }
    }

    // Bitcoinの表示を更新する関数
    function updateBitcoinDisplay(currentPrice, previousClosePrice) {
        const priceElement = document.getElementById('btc-price');
        
        if (priceElement) {
            // 前日終値との差分を計算（前日比）
            const change = currentPrice - previousClosePrice;
            
            // 価格を更新（円表示、小数点以下0桁で表示）
            const formattedPrice = `¥${Math.round(currentPrice).toLocaleString()}`;
            priceElement.innerHTML = `${formattedPrice} <small id="btc-change">${change >= 0 ? '+' : ''}${Math.round(change).toLocaleString()}</small>`;
            
            // 変更量を更新（前日比）
            const changeElement = document.getElementById('btc-change');
            if (changeElement) {
                changeElement.textContent = `${change >= 0 ? '+' : ''}${Math.round(change).toLocaleString()}`;
            }
            
            // 色を更新（アニメーション効果付き）
            priceElement.style.transition = 'color 0.3s ease';
            if (change > 0) {
                priceElement.className = 'price up'; // 前日比で上昇
            } else if (change < 0) {
                priceElement.className = 'price down'; // 前日比で下落
            } else {
                priceElement.className = 'price'; // 前日比で変化なし
            }
            
            // エラー表示フラグをリセット
            if (priceElement.dataset.errorShown) {
                delete priceElement.dataset.errorShown;
            }
        }
    }

    // 市場ティッカーの更新（従来のランダム更新は他の通貨ペア用に保持）
    function updateMarketTicker() {
        const prices = document.querySelectorAll('.price:not(#usd-jpy-price):not(#eur-jpy-price):not(#btc-price)');
        prices.forEach(price => {
            const change = (Math.random() - 0.5) * 2;
            const currentValue = parseFloat(price.textContent.replace(/[^\d.-]/g, ''));
            const newValue = currentValue + change;
            
            if (change > 0) {
                price.className = 'price up';
            } else {
                price.className = 'price down';
            }
        });
    }

    // 初回データ取得
    fetchForexData();
    fetchBitcoinData();
    
    // 5秒ごとにGMO APIから為替データを更新
    setInterval(fetchForexData, 5000);
    
    // 5秒ごとにBitcoinデータを更新
    setInterval(fetchBitcoinData, 5000);
    
    // 5秒ごとにその他の市場データを更新
    setInterval(updateMarketTicker, 5000);
});

// パフォーマンス最適化
// 画像の遅延読み込み
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// スクロール最適化
let ticking = false;
function updateOnScroll() {
    // スクロール処理
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// ページ読み込み完了後の最終調整
window.addEventListener('load', () => {
    // 全体的なパフォーマンス調整
    document.body.style.opacity = '1';
    
    // AI相談ボタンのクリックイベント
    const aiChatTrigger = document.querySelector('.ai-chat-trigger');
    if (aiChatTrigger) {
        aiChatTrigger.addEventListener('click', () => {
            chatOpen = true;
            chatWindow.style.display = 'block';
            setTimeout(() => {
                chatWindow.classList.add('active');
            }, 10);
        });
    }
});