class Game {
  constructor(selector) {
    this.currentPlayer = "gold";
    this.selector = selector;
    this.recent = [];
  }
  setupGrid() {
    var $board = $(this.selector);
    $board.empty();
    for (let rows = 0; rows < 6; rows++) {
      let $row = $("<div>").addClass("row");
      for (let cols = 0; cols < 7; cols++) {
        let $col = $("<div>")
          .addClass("col none")
          .attr("data-row", rows)
          .attr("data-col", cols);
        $row.append($col);
      }
      $board.append($row);
    }
  }
  setupListeners() {
    var $board = $(this.selector);
    var that = this;
    function findLastEmptyCell(col) {
      const cells = $(`.col[data-col='${col}']`);
      for (let i = cells.length - 1; i > -1; i--) {
        let $cell = $(cells[i]);
        if ($cell.hasClass("none")) {
          return $cell;
        }
      }
      return null;
    }
    function findRecent(coor) {
      return $(`.col[data-row='${coor[0]}'][data-col='${coor[1]}']`);
    }
    $board.on("click", ".col", function() {
      let col = $(this).data("col");
      let $last = findLastEmptyCell(col);
      let $recent = findRecent(that.recent);
      $last.removeClass(`none ${this.currentPlayer}`);
      $recent.removeClass(`recent`);
      $last.addClass(that.currentPlayer);
      $last.addClass("recent");
      that.recent = [$last.data("row"), $last.data("col")];

      if(that.isGameOver($last)) {
        setTimeout(() => {
            alert(`GAME OVER: ${that.currentPlayer} won!`)
            that.setupGrid()
        }, 100);
        that.currentPlayer='gold'
        $("#currentPlayer")
            .text(`It's ${that.currentPlayer}'s turn!`)
            .css("color", that.currentPlayer);
        return
      }
      if(that.isDraw()) {
        setTimeout(() => {
            alert(`GAME OVER: It's a Draw!`)
            that.setupGrid()
        }, 100);
        that.currentPlayer='gold'
        $("#currentPlayer")
            .text(`It's ${that.currentPlayer}'s turn!`)
            .css("color", that.currentPlayer);
        return
      }

      that.currentPlayer == "gold"
        ? (that.currentPlayer = "blue")
        : (that.currentPlayer = "gold");

      $("#currentPlayer")
        .text(`It's ${that.currentPlayer}'s turn!`)
        .css("color", that.currentPlayer);
    });
  }
  isDraw() {
      let top = $(`.col[data-row='0']`)
      for(let col = 0; col < 7; col++) {
          if($(top[col]).hasClass('none')) {
              return false
          }
      }
      return true
  }
  isGameOver(last) {
      function checkVer(last) {
          let row = last.data('row')
          let col = last.data('col')
          let team = last.hasClass('gold') ? 'gold' : 'blue'
          let count = 1;
          for(let upCount = -1; true; upCount--) {
              if($(`.col[data-col='${col}'][data-row='${row+upCount}']`).hasClass(team)) {
                  count++
                  continue
              } else {
                  break
              }
          }
          for(let downCount = 1; true; downCount++) {
            if($(`.col[data-col='${col}'][data-row='${row+downCount}']`).hasClass(team)) {
                count++
                continue
            } else {
                break
            }
        }
        return count >= 4
      }
      function checkHor(last) {
        let row = last.data('row')
        let col = last.data('col')
        let team = last.hasClass('gold') ? 'gold' : 'blue'
        let count = 1;
        for(let leftCount = -1; true; leftCount--) {
            if($(`.col[data-row='${row}'][data-col='${col+leftCount}']`).hasClass(team)) {
                count++
                continue
            } else {
                break
            }
        }
        for(let rightCount = 1; true; rightCount++) {
          if($(`.col[data-row='${row}'][data-col='${col+rightCount}']`).hasClass(team)) {
              count++
              continue
          } else {
              break
          }
      }
      return count >= 4
    }

    function checkUpDownDig(last) {
        let row = last.data('row')
        let col = last.data('col')
        let team = last.hasClass('gold') ? 'gold' : 'blue'
        let count = 1;
        for(let leftCount = -1; true; leftCount--) {
            if($(`.col[data-row='${row+leftCount}'][data-col='${col+leftCount}']`).hasClass(team)) {
                count++
                continue
            } else {
                break
            }
        }
        for(let rightCount = 1; true; rightCount++) {
          if($(`.col[data-row='${row+rightCount}'][data-col='${col+rightCount}']`).hasClass(team)) {
              count++
              continue
          } else {
              break
          }
      }
      return count >= 4
    }

    function checkDownUpDig(last) {
        let row = last.data('row')
        let col = last.data('col')
        let team = last.hasClass('gold') ? 'gold' : 'blue'
        let count = 1;
        for(let leftCount = -1, downCount = 1; true; leftCount--, downCount++) {
            if($(`.col[data-row='${row+downCount}'][data-col='${col+leftCount}']`).hasClass(team)) {
                count++
                continue
            } else {
                break
            }
        }
        for(let rightCount = 1, upCount = -1; true; rightCount++, upCount--) {
          if($(`.col[data-row='${row+upCount}'][data-col='${col+rightCount}']`).hasClass(team)) {
              count++
              continue
          } else {
              break
          }
      }
      return count >= 4
    }

      return checkVer(last) || checkHor(last) || checkUpDownDig(last) || checkDownUpDig(last)
  }
}
