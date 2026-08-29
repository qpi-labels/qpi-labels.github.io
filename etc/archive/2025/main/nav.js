fetch('/etc/archive/2025/main/header.html')
	.then(response => response.text())
	.then(data => {
		document.getElementById('header').outerHTML = data;
	})
	.catch(error => console.error('머릿말 로드 실패:', error));

fetch('/etc/archive/2025/main/footer.html')
    .then(response => response.text())
    .then(data => {
        const footerElement = document.getElementById('footer');
        if (footerElement) {
            footerElement.innerHTML = data;
        }
    });
