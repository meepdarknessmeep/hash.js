var cleverbot = new ( require( "cleverbot-node" ) );
var busy = false;
var excited = false;

var phrases = [
	"hello",
	"hey",
	"hi"
];

bot.on( "Message", OnMessage );

function ShouldReply( msg ) {

	// Don't reply if we are already replying
	if ( busy )
		return false;

	// 80% chance to reply if the bot's name is spoken.
	if ( msg.match( /\bHash\b/i ) )
		return Math.random() > 0.20;

	// 10% chance to reply if excited
	if ( excited )
		return Math.random() > 0.90;

	// 10% chance to reply if first word is a defined phrase
	var firstWordLower = msg.toLowerCase().split( " " )[ 0 ];

	if ( phrases.indexOf( firstWordLower ) != -1 )
		return Math.random() > 0.9;

	// 1% chance by default
	return Math.random() > 0.99;

}

function OnMessage( name, steamID, msg, group ) {

	if ( !ShouldReply( msg ) )
		return;

	busy = true;

	// Translate name from Hash to Cleverbot
	msg = msg.replace( /\bHash\b/ig, "Cleverbot" );

	cleverbot.write( msg, function( res ) {

		if ( res && res.message ) {

			// Translate name from Cleverbot to Hash
			res.message = res.message.replace( /\bCleverbot\b/ig, "Hash" );

			bot.sendMessage( res.message, group );

		}

		busy = false;

	} );

}
