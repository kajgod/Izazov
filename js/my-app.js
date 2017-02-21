/* GLOBALNE VARIJABLE */

var korisnik, korisnici;

var socket = io(socketServer);

function onLoad() {
	// OVO VRATITI U DEVICEREADY ZA KONAČNU APP!!!
      document.addEventListener("deviceready", init, false);
     //init();
   }

function init() {
	$.ajaxSetup ({
		cache: false
	});
	$('img.logotip').attr('src',socketServer+'tablet/logotip.png');
}

$(function(){



	/* RESET JAVASCRIPT */

	function resetall(){
		$('.profil').hide();
		$('.ime').val('');
		$('.profilself').html('');
		$.getJSON( socketServer+"profili/index.json", function( data ) {
		  $('body').append(data);
		  korisnici=data;
		});
	}

	/* ODABIR JAVASCRIPT */

	$('.novi').click(function(){
		$('#prviizbor').hide();
		$('#profil').show();
		korisnik=Math.ceil(Math.random()*Math.pow(10,16));
		$('.profilself').html('<img src="'+socketServer+'/profili/i'+korisnik+'.png">'+socketServer+'/profili/i'+korisnik+'.png');
	});

	/* PROFIL JAVASCRIPT */
	$('.selfi').click(function(){
		$('body').append('click'+igrac);
		navigator.camera.getPicture(onSuccess, onFail, { 
		    quality: 80,
		    targetWidth: 450,
		    targetHeight: 600,
		    destinationType: Camera.DestinationType.DATA_URL
		});
		 
		function onSuccess(imageData) {
			$('body').append('onsuccess'+igrac);
		     $.post( socketServer+'/selfi', {data: imageData, id: korisnik, igrac:igrac}, function(data) {
			  });
		     
		}
		 
		function onFail(message) {
		}
	});
	$('.submit').click(function(){
		var nick=$('.ime').val();
		$.post( socketServer+'/profil', {id: korisnik, nick:nick, igrac:igrac}, function(data) {
			  });
	});


	/*PITANJA ODGOVORI*/

	$('.odgovor').click(function(){
		switch($(this).attr('class')) {
		    case "odgovor odg1":
		        odgovaram(1);
		        break;
		    case "odgovor odg2":
		        odgovaram(2);
		        break;
		    case "odgovor odg3":
		        odgovaram(3);
		        break;
		    case "odgovor odg4":
		        odgovaram(4);
		        break;
		    default:
		        return false;
		}
	});

});

/* SOCKET AKCIJE */

socket.on('selfieupdt', function(msg){
	$('body').append(msg+' '+igrac+'<br>');
	 if(msg==igrac)$('.profilself').html('<img src="'+socketServer+'/profili/i'+korisnik+'.png?v='+Date.now()+'">'+socketServer+'/profili/i'+korisnik+'.png');
});

socket.on('reset', function(msg){
	resetall();
});

socket.on('promijenipitanjetablet', function(msg){
	promijenipitanje(msg);
});

socket.on('odbrojavanjetablet', function(msg){
	$('.odbrojavanje').html(''+msg);
});


/* funkcije */
function promijenipitanje(objektiv){
	var pit=objektiv.pitanje, od1=objektiv.odg1, od2=objektiv.odg2, od3=objektiv.odg3, od4=objektiv.odg4;
	/*exportRoot.pitanje.brojpitanja.text=br+'. pitanje';*/
	$('.pitanje').html(pit);
	$('.odg1').html(od1);
	$('.odg2').html(od2);
	$('.odg3').html(od3);
	$('.odg4').html(od4);
	$('.odbrojavanje').html('');
	$('.odbrojavanje').hide();
	$('.odgovor').show();
	/*exportRoot.pitanje.gotoAndPlay(1);
	aktualnoPitanje++;*/
}

function odgovaram(x){
	socket.emit('odgovaram', {igrac:igrac, odgovor:x});
}