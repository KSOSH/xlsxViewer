!(function(){
	const params = window.location.search.replace('?','').split('&').reduce((p,e) =>{
			const a = e.split('=');
			p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
			return p;
		},{}),
		domain = window.location.origin + '/',
		inner = document.getElementById('inner'),
		title = document.getElementById('title'),
		download = document.getElementById('download'),
		wrapper = document.querySelector('.wrapper'),
		spreadsheetFn = (function() {
			return function spreadsheetFn(wb) {
				var data = stox(wb);
				x_spreadsheet(
					'#inner',
					{
						//mode: 'read', // edit | read
						showToolbar: true,
						showGrid: true,
						showBottomBar: true,
						showContextmenu: true,
						view: {
							width: () => inner.offsetWidth,
							height: () => wrapper.offsetHeight
						},
					}
				).loadData(data);
			};
		})(),
		fl = params['file'] ? params['file'].replace(/^\/?/, '') : false;
	//inner.style.height = PTOP + 'px';
	//inner.style.overflow = 'hidden';
	if(fl) {
		const file = /^((?:http|https|ftp):\/\/)/.test(fl) ? fl : domain + fl;
		title.innerHTML = document.getElementsByTagName('title')[0].innerHTML = file.split('/').at(-1);
		fetch(file).then(function(res){
			res.arrayBuffer().then(function(ab){
				const wb = XLSX.read(ab);
				spreadsheetFn(wb);
				download.setAttribute("href", file);
			}).catch(function(e){
				console.log(e);
				document.body.classList.add('error');
			});
		}).catch(function(e){
			console.log(e);
			document.body.classList.add('error');
		});
	}
	
}());