// Search functionality for the website
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-box form');
    const searchInput = document.querySelector('.search-box input[name="q"]');
    const resultsContainer = document.querySelector('.search-results');
    
    // Comprehensive search index
    const searchIndex = [
        {
            title: '入学案内',
            url: '../prospective/index.html',
            content: '入試情報、オープンキャンパス、奨学金、よくある質問など入学に関する情報を提供しています。'
        },
        {
            title: '学部紹介',
            url: '../faculty/index.html',
            content: '建築学科、機械工学科、土木工学科、電気工学科、電子工学科、物質応用化学科、物理学科、数学科の紹介ページです。'
        },
        {
            title: 'キャンパスライフ',
            url: '../campus/index.html',
            content: 'カリキュラム、国際交流、学生生活ガイド、履修関連システムなど学生生活に関する情報を提供しています。'
        },
        {
            title: '就職支援',
            url: '../career/index.html',
            content: '就職実績データ、資格・公務員試験対策、企業向け求人案内などキャリア支援情報を提供しています。'
        },
        {
            title: '研究・大学院',
            url: '../research/index.html',
            content: '大学院(理工学研究科)案内、研究プロジェクト、研究施設、研究者情報データベースなど研究関連情報を提供しています。'
        },
        {
            title: '学部概要',
            url: '../about/index.html',
            content: '自己点検・評価、地域連携、学部の歴史と理念など学部概要に関する情報を提供しています。'
        },
        {
            title: 'ニュース',
            url: '../news/index.html',
            content: '日大理工通信、広報誌・動画ギャラリー、SNS公式アカウントなど最新情報を提供しています。'
        },
        {
            title: 'アクセス',
            url: '../contact/index.html',
            content: '駿河台キャンパスと船橋キャンパスのアクセス情報を提供しています。'
        },
        {
            title: '在学生の方',
            url: '../student/index.html',
            content: '在学生向けの各種情報を提供しています。'
        },
        {
            title: '保護者の方',
            url: '../parents/index.html',
            content: '保護者向けの各種情報を提供しています。'
        },
        {
            title: '企業・研究者の方',
            url: '../partner/index.html',
            content: '企業・研究者向けの各種情報を提供しています。'
        }
    ];

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
            showMessage('検索キーワードは2文字以上入力してください。');
            return;
        }

        const results = searchIndex.filter(item => {
            return item.title.toLowerCase().includes(query) || 
                   item.content.toLowerCase().includes(query);
        });

        displayResults(results, query);
    });

    function displayResults(results, query) {
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-info">
                    <p>"${query}" の検索結果: 0件</p>
                </div>
                <div class="no-results">
                    <p>該当する結果が見つかりませんでした。</p>
                    <p>検索キーワードを変えて再度お試しください。</p>
                </div>`;
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="search-result">
                <h3><a href="${result.url}">${result.title}</a></h3>
                <p>${highlightQuery(result.content, query)}</p>
            </div>
        `).join('');

        resultsContainer.innerHTML = `
            <div class="search-info">
                <p>"${query}" の検索結果: ${results.length}件</p>
            </div>
            ${resultsHTML}`;
    }

    function highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    function showMessage(message) {
        resultsContainer.innerHTML = `
            <div class="search-message">
                <p>${message}</p>
            </div>`;
    }
});