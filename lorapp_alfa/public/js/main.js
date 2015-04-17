// START: #changing-message va rotando
function nextMsg() {
    if (messages.length == 0) {
        messages = [
			"Menos piratería",
			"Más ahorro",
			"Menos peso",
			"Menos árboles talados",
			"Menos tiempo en filas",
			"Menos desplazamientos",
			"Menos preocupaciones",
			"Menos desorden",
			"Más modernidad",
		].reverse();
		$('#changing-message').html(messages.pop()).fadeIn(500).delay(1000).fadeOut(500, nextMsg);
    } else {
        $('#changing-message').html(messages.pop()).fadeIn(500).delay(1000).fadeOut(500, nextMsg);
    }
};

var messages = [
	"Menos piratería",
	"Más ahorro",
	"Menos peso",
	"Menos árboles talados",
	"Menos tiempo en filas",
	"Menos desplazamientos",
	"Menos preocupaciones",
	"Menos desorden",
	"Más modernidad",
].reverse();

$('#changing-message').hide();
nextMsg();
// END: #changing-message va rotando

// START: Bootstrap tooltip
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
// END: Bootstrap tooltip