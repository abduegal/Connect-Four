/**
 * Created with IntelliJ IDEA.
 * User: AbdullahiE
 * Date: 9-9-13
 * Time: 14:13
 * To change this template use File | Settings | File Templates.
 */

function load(){
  new Game().load();
}

function Game(){
  this.context;
  this.tile = new Array();
  this.tileWidth;
  this.tileHeight;

  this.rows = 6;
  this.cols = 7;

  this.width = 70;
  this.height = this.width;

  this.turns = ['green', 'red'];
  this.currentTurn = this.turns[0];

  /**
   * Onload event, code starts here
   */
  this.load = function(){
    this.canvas = document.getElementById("game");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.cols * this.width;
    this.canvas.height= this.rows * this.height;
    this.initTiles();
    this.clickEvents();
  };

  /**
   * Initializes all tiles and draws them once
   */
  this.initTiles = function(){
    for(var i = 0; i < this.cols; i++){
      this.tile[i] = new Array();
      for(var j = 0; j < this.rows; j++){
        this.tile[i][j] = new Tile();
        this.tile[i][j].draw(i * this.width, j * this.height, this.width, this.height, this.context);
      }
    }
    this.showTurn();
  };

  /**
   * (Re)Draws the game field with the tiles
   */
  this.draw = function(){
    for(var i = 0; i < this.cols; i++){
      for(var j = 0; j < this.rows; j++){
        this.tile[i][j].draw(i * this.width, j * this.height, this.width, this.height, this.context);
      }
    }
  };

  /**
   * Listens to the following events
   *  Clickevent: mouse click to place a tile
   *  mousemove event: To set a ghost tile
   *  Mouseexit event: To remove the ghost tile
   */
  this.clickEvents = function(){
    var self = this;
    this.canvas.addEventListener('click', function(ev){
      var x = ev.clientX - self.canvas.offsetLeft;
      var position = Math.floor(x / self.width);
      self.placeTile(position);
    }, false);
    this.canvas.addEventListener('mousemove', function(ev){
      var x = ev.clientX - self.canvas.offsetLeft;
      var position = Math.floor(x / self.width);
      self.ghostHover(position);
    }, false);
  };

  /**
   * Places a new tile on a x position
   */
  this.placeTile = function(xPosition){
    var tiles = this.tile[xPosition];
    //start from the last tiles (bottom) and check if a tile already exists there
    for(var i = this.rows - 1; i >= 0; i--){
      if(tiles[i].coin === 'none'){
        tiles[i].coin = this.currentTurn;
        this.draw();
        this.winCheck(this.currentTurn, tiles[i], xPosition, i);
        this.changeTurn();
        return;
      }
    }
  };

  /**
   * Sets a ghost color on hover
   */
  this.ghostHover = function(xPosition){
    var tiles = this.tile[xPosition];
    //start from the last tiles (bottom) and check if a tile already exists there
    for(var i = this.rows - 1; i >= 0; i--){
      if(tiles[i].coin === 'none'){
        if(this.currentTurn === this.turns[0]){
          tiles[i].ghost = '#BBFFBB';
        }else{
          tiles[i].ghost = '#FFBBBB';
        }
        this.draw();
        tiles[i].ghost = undefined;
        return;
      }
    }
  };

  /**
   * Switches the turn (color and tile type)
   */
  this.changeTurn = function(){
    if(this.currentTurn === this.turns[0]){
      this.currentTurn = this.turns[1];
    }else{
      this.currentTurn = this.turns[0];
    }
    this.showTurn();
  };

  /**
   * Shows the turn in text to the user
   */
  this.showTurn = function(){
    document.getElementById('turn').innerHTML = this.currentTurn + 's Turn';
  };

  /**
   * Checks if someone has won
   */
  this.winCheck = function(color, lastPlacedTile, lastPlacedX, lastPlacedY){
    /**
     * Checks win condition in the horizontal line
     */
    this.checkHorizontal = function(){
      var sameTilesBefore;
      var sameTilesAfter;
      var sameTilesBefore = this.checkSameTilesRecursive(lastPlacedX, lastPlacedY, -1, 0, color, 0);
      var sameTilesAfter = this.checkSameTilesRecursive(lastPlacedX, lastPlacedY, 1, 0, color, 0);
      if(sameTilesBefore + sameTilesAfter === 3){
        return true;
      }
      return false;
    };

    /**
     * Checks win condition in the vertical line
     */
    this.checkVertical = function(){
      var sameTilesBefore;
      var sameTilesAfter;
      var sameTilesBefore = this.checkSameTilesRecursive(lastPlacedX, lastPlacedY, 0, -1, color, 0);
      var sameTilesAfter = this.checkSameTilesRecursive(lastPlacedX, lastPlacedY, 0, 1, color, 0);
      if(sameTilesBefore + sameTilesAfter === 3){
        return true;
      }
      return false;
    };

    /**
     * Checks win condition in the diagonal line /
     */
    this.checkDiagonalBotToTop = function(){
      var sameTilesBefore;
      var sameTilesAfter;
      var sameTilesBefore = this.checkSameTilesRecursive(lastPlacedX, lastPlacedY, -1, -1, color, 0);
      var sameTilesAfter = this.checkSameTilesRecursive(lastPlacedX, lastPlacedY, 1, 1, color, 0);
      if(sameTilesBefore + sameTilesAfter === 3){
        return true;
      }
      return false;
      console.log(sameTilesAfter + '  ' + sameTilesAfter);
    };

    /**
     * Checks win condition in the diagonal line \
     */
    this.checkDiagonalTopToBot = function(){
      var sameTilesBefore;
      var sameTilesAfter;
      var sameTilesBefore = this.checkSameTilesRecursive(lastPlacedX, lastPlacedY, -1, 1, color, 0);
      var sameTilesAfter = this.checkSameTilesRecursive(lastPlacedX, lastPlacedY, 1, -1, color, 0);
      if(sameTilesBefore + sameTilesAfter === 3){
        return true;
      }
      return false;
    };

    this.returnTileColorForPosition = function(xPosition, yPosition){
      return this.tile[xPosition][yPosition].coin;
    };
    this.checkSameTilesRecursive = function(currentX, currentY, changeX, changeY, currentColor, numberOfOccurence){
      var newX = currentX + changeX;
      var newY = currentY + changeY;
      if(newX < 0 || newY < 0 || newX >= this.cols || newY >= this.rows){
        return numberOfOccurence;
      }
      if(currentColor === this.returnTileColorForPosition(newX, newY)){
        numberOfOccurence = numberOfOccurence + 1;
        return this.checkSameTilesRecursive(newX, newY, changeX, changeY, color, numberOfOccurence);
      }
      return numberOfOccurence;
    };

    var boolean = this.checkHorizontal();
    if(!boolean){
      boolean = this.checkVertical();
    }
    if(!boolean){
      boolean = this.checkDiagonalBotToTop();
    }
    if(!boolean){
      boolean = this.checkDiagonalTopToBot();
    }
    if(boolean){
      alert( color + " wins");
      this.initTiles();
    }

  };

}
