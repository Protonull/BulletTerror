export const ScoreIcons = [
  {x: 450, y: 100, width: 50, height: 50},
  {x: 0, y: 100, width: 50, height: 50},
  {x: 50, y: 100, width: 50, height: 50},
  {x: 100, y: 100, width: 50, height: 50},
  {x: 150, y: 100, width: 50, height: 50},
  {x: 200, y: 100, width: 50, height: 50},
  {x: 250, y: 100, width: 50, height: 50},
  {x: 300, y: 100, width: 50, height: 50},
  {x: 350, y: 100, width: 50, height: 50},
  {x: 400, y: 100, width: 50, height: 50}
];

export class Score {

  /** @param {number} score */
  static convertScoreToIcon(score) {
    let result = score == 0 ? [ScoreIcons[0]] : [];
    while ((score / 10) > 0) {
      result.push(ScoreIcons[score % 10]);
      score = Math.floor(score / 10);
    }
    result.reverse();
    return result;
  }

}