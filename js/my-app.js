/* GLOBALNE VARIJABLE */
var korisnik, korisnici, disejbling=0;
var pazibroj=false;


var socket = io(socketServer);

function onLoad() {
	// OVO VRATITI U DEVICEREADY ZA KONAČNU APP!!!
      document.addEventListener("deviceready", init, false);
     //init();
   }
var juzersi={};
var lista=[];
function init() {
	$.ajaxSetup ({
		cache: false
	});
	/* Cordova funkcije */
	AndroidFullScreen.immersiveMode(function(){
		}, function(){
		});
	window.plugins.insomnia.keepAwake();
	/* */
	$('img.logotip').attr('src',socketServer+'/tablet/logotip.png');
	$.getJSON(socketServer+'/profili/index.json', function(vr){
		$.each(vr, function(key, val){
			juzersi[val.nick]=''+key;
			lista.push(''+val.nick);
		});
		lista.sort(function(a, b) {
		    var textA = a.toUpperCase();
		    var textB = b.toUpperCase();
		    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});
		console.log(lista);
	});
	
}

/* helper funkcije */

function restart(klasa, roditelj){
	 var el     = roditelj.parent().children('.'+klasa),  
     newone = el.clone(true);    
     el.html('');     
	 el.before(newone);        
 	 el.remove();
}



$(function(){

	/* ODABIR JAVASCRIPT */

	$('.novi').click(function(){
		$('.upozorenje').html('');
		$('#prviizbor').hide();
		$('#odabir').hide();
		$('#profil').show();
		$('#profil2').hide();
		$('input.ime').val('');
		korisnik=Math.ceil(Math.random()*Math.pow(10,16));
		$('.profilself').html('<img src="'+socketServer+'/profili/default.png">');
	});

	$('.postojeci').click(function(){
		$('.upozorenje').html('');
		$('#prviizbor').hide();
		$('#profil').hide();
		$('#profil2').hide();
		$('#odabir').show();
		$('#odabir .popispro').html(function(){
			var izb='<ul class="izb">';
			$.each(lista, function(key, val){
				izb=izb+'<li>'+val+'</li>';
			});
			return izb+'</ul>';
		});
	});

	/* PROFIL JAVASCRIPT */
	$('.selfi').click(function(){
		navigator.camera.getPicture(onSuccess, onFail, { 
		    quality: 80,
		    targetWidth: 450,
		    targetHeight: 600,
		    destinationType: Camera.DestinationType.DATA_URL
		});
		 
		function onSuccess(imageData) {
		     $.post( socketServer+'/selfi', {data: imageData, id: korisnik, igrac:igrac}, function(data) {
			  });
		     
		}
		 
		function onFail(message) {
		}
	});
	$('.submit').click(function(){
		var nick=$('.ime').val();
		if(nick.length<3||nick.length>23){
			$(this).parent().children('.upozorenje').html('Nadimak može imati najmanje tri (3), a najviše dvadeset (20) slova!');
			restart('upozorenje', $(this));
		}else{
			if(typeof(juzersi[nick])=='undefined'){
				igracspreman(korisnik, nick, igrac);
			}else{
				$(this).parent().children('.upozorenje').html('Nadimak je već korišten. Dodajte neki znak (npr. godinu rođenja) ili odaberite drugi profil, ako je to Vaš nadimak od ranije.');
				restart('upozorenje', $(this));
			}
			
		}
		
	});

	$('.submit2').click(function(){
		igracspreman(korisnik, $('.ime2').html(), igrac);
	});

	/*zajednička funkcija za spremnog igrača */

	function igracspreman(korisnik, nick, igrac){
		$.post( socketServer+'/profil', {id: korisnik, nick:nick, igrac:igrac}, function(data) {
				});
		$('#odabir').hide();
		$('#profil').hide();
		$('#profil2').hide();
		$('#sacekivanje').show();
		$('.upozorenje').html('');
	}

	/* POSTOJEĆI KORISNIK */

	$('.popispro').on('click', 'li', function(){
		dejta=$(this).html();
		$('#odabir').hide();
		$('#profil2').show();
		$('.ime2').html(dejta);
		korisnik=juzersi[''+dejta];
		$.get(socketServer+'/profili/i'+korisnik+'.png')
		    .done(function() { 
		        $('.profilself').html('<img src="'+socketServer+'/profili/i'+korisnik+'.png">');       
		    }).fail(function() {
		    	$('.profilself').html('<img src="'+socketServer+'/profili/default.png">');
		    });
		
		/*igracspreman(juzersi[''+data.target.innerText], data.target.innerText, igrac);*/

	});


	/*PITANJA ODGOVORI*/
	$('.odgovor').click(function(){
		if(!pazibroj){
			$(this).addClass('kliknuto');
			pazibroj=true;
		}
		if(disejbling==0){
			disejbling=1;
			switch($(this).data('val')) {
			    case 1:
			        odgovaram(1);
			        break;
			    case 2:
			        odgovaram(2);
			        break;
			    case 3:
			        odgovaram(3);
			        break;
			    case 4:
			        odgovaram(4);
			        break;
			    default:
			        return false;
			}
		}
	});

	/* REVANŠ */
	$('.ponovi').click(function(){
		socket.emit('revans', true);
		$('#konacnareza').hide();
	});
	$('.odustani').click(function(){
		socket.emit('revans', false);
		$('#konacnareza').hide();
	});

});

/* SOCKET AKCIJE */

socket.on('selfieupdt', function(msg){
	//$('body').append(msg+' '+igrac+'<br>');
	 if(msg==igrac)$('.profilself').html('<img src="'+socketServer+'/profili/i'+korisnik+'.png?v='+Date.now()+'">');
});

socket.on('resetiraj', function(msg){
	console.log('reset');
	resetall();
});

socket.on('promijenipitanjetablet', function(msg){
	$('.odgovor').removeClass('kliknuto');
	$('.hidpit').show();
	$('.odbrojavanje').hide().html('3');
	promijenipitanje(msg);
});

socket.on('odbrojavanjetablet', function(msg){
	$('#sacekivanje').hide();
	$('#pitanja').show();
	$('.hidpit').hide();
	$('.odbrojavanje').show().html(''+msg);
});

socket.on('pobjednik',function(msg){
	//igrac:igg, nick:ime[igg]
	if(msg.igrac==0){
	}else if(msg.igrac==igrac){
		$('#konacnareza').html('<h3>Čestitamo na pobjedi!</h3>');
	}else{
		$('#konacnareza').html('<h3>Više sreće sljedeći put!</h3>');
	}
	$('#pitanja').hide();
	$('#konacnareza').show();
});

socket.on('sekundet', function(msg){
	if(msg<=1)setTimeout(function(){
		$('.hidpit').hide();
		$('.timer').html('30');
	}, 300);
	$('.timer').html(''+(-1+msg));
});

socket.on('revansserver', function(msg){
	$('#konacnareza').hide();
});


/* funkcije */
function promijenipitanje(objektiv){	
	pazibroj=false;
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
	disejbling=0;
	/*exportRoot.pitanje.gotoAndPlay(1);
	aktualnoPitanje++;*/

}

function odgovaram(x){
	socket.emit('odgovaram', {igrac:igrac, odgovor:x});
}

/* RESET JAVASCRIPT */

function resetall(){
	location.reload();
}