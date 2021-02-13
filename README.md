# BulletTerror

This became the sequel to [Circleplosion](https://github.com/Protonull/Circleplosion) in which I recreated the game using [ImpactJS](https://impactjs.com/), the game engine. It doesn't use its level functionality, instead opting for direct manipulation of the canvas, essentially using impact as a framework rather than an engine… if that makes sense. The few changes I made were that the players could no longer freely move around the arena, but instead are restrained to move and dodge within the bounds of their respective side. Players can also aim their weapon, although if I re-create this game that feature will be removed as it generally makes playing the game harder than aiming via moving. The buffs and debuffs remain but are activated by being shot rather than moved over. When a player dies, it automatically receives an immunity buff while the player resets and their opponent receives a point.

## Controls

Player One

Action | Key(s)
----|----
Player 1 Move Up | W
Player 1 Move Down | S
Player 1 Shoot | Space

Player Two

Action | Key(s)
----|----
Player 2 Move Up | Up Arrow
Player 2 Move Down | Down Arrow
Player 2 Shoot | Enter

## Buffs and Debuffs

Icon | Target | Description
----|----|----
Purple Orbs | Self | Whenever you deal non-trivial damage to an enemy, you will automatically fire another bullet.
Red Skull | Enemy | Deals a significant amount of damage to the enemy over time.
Yellow Bomb | Self | Your next attack will fire a large grenade that will explode on contact, greatly damaging the enemy it hits.
Aqua Chained Man | Enemy | Your enemy will be slowly dragged towards the centre of their side.
Blue Shield | Self | Your next attack will instead spawn a wall that will destroy incoming projectiles.
Yellow Dash | Self | Your next attack will instead teleport you to your mirrored position.
Purple Zapped Man | Self | You will heal a significant portion of your health over time.
Fireball | Self | Your next attack will instead summon a meteor that will do devastating damage.
Two Missiles | Self | Your next attack will instead fire a swarm of heat seeking missiles.
Netting | Enemy | Your enemy will be prevented from moving for a short time.
Blue Orb | Self | The lifespan and charges of all the buffs/debuffs you current have are doubled.
Shield | Self | You are immune to damage for a short period.
Blue Scream | Enemy | Your enemy will not regenerate health for a short period.
Orange Chain | Enemy | Your enemy will move slower for a short period.
Red Bullet | Self | Your next attack will fire a thin, fast moving bullet.
Boots | Self | You will move faster for a short period.
Blue Static | Self | Whenever an enemy deals damage to you, deal a percentage back.
Exhaustion | Self | You will move slowly when low on energy.
Blue Holy Man | Self | When you die, your health will reset after a short period, during which you are immune to damage. You will lose all buffs you currently have and will not be able to grab new ones until you fully respawn.

## Remake

This is actually a remake of the same game but written in es6 thanks to [myvirtigo](https://github.com/myvertigo)'s [impactES6](https://github.com/myvertigo/impactES6) addon. It also uses the easing functions from [nefD's impact-tween](https://github.com/nefD/impact-tween) plugin, specifically used for the heat seeking missiles. [Primus' EventEmitter3](https://github.com/primus/eventemitter3) module is also used.

## Improvements

* Removed the aim feature, it actually made the game harder to play.

* Buffs are now self functional, rather than merely being a struct of sorts. Players will still process and manage buffs, but it's up to the buffs themselves through overriden methods to decide how they function.

* More than one Buff can be on stage at a time.

* More buffs that do interesting things.

* Resetting: to avoid having to track base stats and additional stats, a player's stats are reset each update and it's up to buffs that add or subtract from those stats to keep doing so each update. It's less elegant than an event based system, but far more practical and less prone to bugs.

* Flags: in the previous version, health regeneration was prevented by checking if the player was either dead or had that particular buff. This could get unwieldy as new buffs/debuffs are introduced. And so instead buffs can set a flag that will prevent health regeneration, or movement, or the ability to fire bullets, and so on. These flags must be re-set each update.

* Players now have eventemitters, which allows for some behaviour to be delegated to event listeners rather than having extensive methods on the Player class.

## Hindsight

If I were to make any changes for another major update it would be:

* Spawning buffs have a randomised Y position, and if that position would cause an overlap with another buff, it tries again ten times. If that fails then the buff is removed. This does make a fully buffed stage look more natural but can make buff spawns irregular as they fail to randomly find positions that are available. Instead I would have a grid system that would spawn a buff if and only if there's an empty cell.

* When a player receives damage, it only knows how much and by whom. I would expand to include by what. Currently there is a buff that spawns additional bullets when you land "non-trivial" damage, which basically means more than five damage in a single call, which *should* prevent bullets from being spawned by damage over time effects, and the heat seeking missiles.

* Add a property to buffs to tell whether it's a buff or debuff, which could allow for greater scrutiny of buffs, such as perhaps only removing debuffs upon death.

* Combine Buff and EntityBuff. I think the current system is *fine* but feels a little bloated. It would make buff management arguably easier, but then there'd be double the methods. But I think it's doable, if not preferable in the same way that there's no EntityPlayer and Player.

* Find a better way to store default values. While remaking this, I was exporting an object with the values, but this object is inaccessible from the console, making it difficult to debug. I switched over to using class static values, but as you also can't access those classes for the same reason, you're left with doing `ig.game.constructor.width` for example to get the game's default width (not necessarily its current width - `ig.system.width`) which seems clunky.

* Use a different engine or create my own. If I'm honest, I'm hardly using impactjs. I'm using it mostly for its collision detection, asset loading, and animation classes. I *could* make an engine that would serve this game within a few days, but I'd have to extend it to add sounds - if that's something I'd want to do - or general text, or if I want to use actual levels. And so currently I just use the parts of impactjs most useful to me, along with extending it a little.

* Not use icons from other games. It currently uses icons from World of Warcraft, League of Legends, and DotA2. I'd create my own assets or use some from a site like [OpenGameArt](https://opengameart.org/), but I just wanted to get the game working.

## Git History

Sadly the git history, if this ever had one, is lost to time.