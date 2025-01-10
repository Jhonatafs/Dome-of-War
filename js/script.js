//click menu
function clickMenu() {
    if(document.getElementById('menu').style.display != 'none') {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('burguer').classList.remove('fa-xmark');
        document.getElementById('burguer').classList.add('fa-bars');
    }else {
        document.getElementById('menu').style.display = 'block';
        document.getElementById('burguer').classList.remove('fa-bars');
        document.getElementById('burguer').classList.add('fa-xmark');
    }
}