/**
 * Collection of humorous "drunk" fortune cookie messages
 */
const fortunes = [
  "You will soon come into possession of another fortune cookie. Weird, right?",
  "The stars say you're awesome! And the stars have had a few, so they're EXTRA honest right now.",
  "Your future's so bright, you'll need *burp* sunglasses... and aspirin.",
  "You will live a long and happy life... if you stop taking fortune cookie advice from alcoholic baked goods.",
  "Money is coming your way! But probably not enough to pay for those drinks you just bought.",
  "A secret admirer will reveal themselves soon... once they finish this last round.",
  "Don't worry about money. The best things in life are *hiccup* free... like this advice!",
  "Your lucky numbers are... wait, why are there so many numbers? They're all spinning...",
  "Life is a journey, not a destination. But if this journey doesn't stop spinning soon, I might be sick.",
  "Your talents will be recognized and suitably rewarded... maybe not today though, I'm kinda tipsy.",
  "A friend is a present you give yourself. A drink is a present you give your friend. Wait, where was I going with this?",
  "Fortune favors the bold, the brave, and people who buy the next round.",
  "Great things come in small packages. Like shots. Have you tried shots?",
  "Your path is cloudy... but that might just be the beer goggles.",
  "Trust your intuition, especially when it says 'one more won't hurt.'",
  "You will soon embark on a journey... to find some late-night tacos.",
  "Hard work will pay off in the future. Laziness will pay off now. Especially if you're too tipsy to work anyway.",
  "You will make a name for yourself. Possibly 'that person who danced on the table last night.'",
  "Today it's up to you to create the peacefulness you long for. But first, where did we put that bottle opener?",
  "Your ability to juggle many tasks will be tested. Like walking and talking at the same time right now.",
  "A conclusion is simply the place where you got tired of thinking. Or where the bartender cut you off.",
  "Your problem isn't the beer. Your problem is that glass thing around the beer keeps emptying.",
  "Embrace your uniqueness, especially your unique ability to turn water into wine... into a hangover.",
  "A friend asks only for your time, not your money... unless they're at the bar, then definitely your money.",
  "If you think nobody cares if you're alive, try missing a couple of bar tabs.",
  "Prosperity will knock on your door soon. Unless you keep spending all your money on fancy cocktails.",
  "You will find a thing. It's definitely a thing. I forget what kind of thing, but it's very... thing-like.",
  "Life is too short to wait. Unless you're waiting for your drink, then please be patient with the bartender.",
  "The greatest risk is not taking one. Second greatest is taking 'just one more for the road.'",
  "Your future holds many surprises. Like how bad tomorrow morning is going to feel."
];

/**
 * Returns a random fortune from the collection
 */
function getRandomFortune() {
  const randomIndex = Math.floor(Math.random() * fortunes.length);
  return fortunes[randomIndex];
}

module.exports = {
  fortunes,
  getRandomFortune
};