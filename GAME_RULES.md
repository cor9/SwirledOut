# SwirledOut Game Rules & Features

## Game Overview

SwirledOut is a turn-based multiplayer board game with customizable action cards, timers, punishments, and multiple win conditions.

## Core Mechanics

### 🎲 Dice System
- **Roll**: Players roll 2 dice (2-12 total)
- **Movement**: Move your pawn the rolled number of spaces
- **Special Rolls**:
  - Double 6 = Roll again
  - Double 1 = Draw punishment card

### 🎴 Card System

#### Card Categories
- **Truth** 💭: Answer questions honestly
- **Dare** 🎯: Perform physical actions
- **Challenge** ⚡: Timed or skill-based tasks
- **Punishment** ⚠️: Negative consequences
- **Reward** 🎁: Positive bonuses
- **Wild** 🌟: Player chooses category

#### Card Properties
- **Intensity**: mild, medium, intense (affects scoring)
- **Timer**: Optional countdown timer (seconds)
- **Punishment**: What happens if failed/skipped
- **Reward**: Bonus for completion

### 🗺️ Board Tiles

- **Start** (Green): Beginning position
- **Normal** (Gray): Regular spaces
- **Action** (Purple): Draw action card
- **Punishment** (Orange): Draw punishment card
- **Reward** (Green): Move forward 2 spaces
- **Wild** (Pink): Choose any category
- **Finish** (Red): Win condition

### ⏱️ Timer System

- Cards can have optional timers
- Default timer: 60 seconds (configurable)
- Timer runs down automatically
- If timer expires: Apply punishment (if enabled)

### 🎯 Scoring System

- **Mild cards**: 1 point
- **Medium cards**: 2 points
- **Intense cards**: 3 points
- **Completed actions**: Tracked separately
- **Punishments**: Tracked (affects final score)

### ⚠️ Punishment System

When a player:
- Skips an action (if punishment on skip enabled)
- Fails a timed challenge
- Lands on punishment tile

Possible punishments:
- Move back 3 spaces
- Skip next turn
- Draw another action card
- Lose 2 points
- Complete extra challenge

### 🏆 Win Conditions

Configure in game rules:
1. **First to Finish**: First player to reach the end tile
2. **Most Actions**: Player with most completed actions
3. **Highest Score**: Player with highest point total

### 🎮 Game Phases

1. **Setup**: Initialize players and board
2. **Playing**: Roll dice, move, draw cards
3. **Action**: Complete or skip action card
4. **Paused**: Safe word activated
5. **Finished**: Game over, winner declared

### ⚙️ Game Rules (Configurable)

- **Win Condition**: Choose how to win
- **Allow Skip**: Can players skip actions?
- **Punishment on Skip**: Apply punishment when skipping?
- **Timer Enabled**: Use timers for timed cards?
- **Default Timer**: Default seconds for timed cards

### ➕ Custom Cards

Players can create custom cards with:
- Text/description
- Intensity level
- Category
- Optional timer
- Optional punishment
- Optional reward

Cards are saved to the game's action deck and persist for the session.

## Game Flow Example

1. Player rolls dice → Gets 7
2. Moves 7 spaces → Lands on "Action" tile
3. Draws action card → "Dance for 30 seconds" (Dare, Medium, 30s timer)
4. Timer starts counting down
5. Player completes action → Gets 2 points, moves forward 2 spaces (if reward)
6. Next player's turn

## Special Features

### Safe Word
- Any player can pause the game at any time
- All players can take a break
- Resume when ready

### Consent Tools
- Skip button on every action
- No judgment for skipping
- All actions are consensual

### Privacy
- No data stored
- No logging of actions
- Anonymous play
- Private rooms only

