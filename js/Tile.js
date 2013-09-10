/**
 * Created with IntelliJ IDEA.
 * User: AbdullahiE
 * Date: 9-9-13
 * Time: 14:23
 * To change this template use File | Settings | File Templates.
 */

function Tile(){

  this.coin = 'none';
  this.ghost = false;

  this.draw = function(x, y, width, height, canvas){
    canvas.strokeStyle = '#000';
    canvas.strokeRect(x, y, width, height);

    if(this.coin === 'none'){
      if(this.ghost){
        canvas.fillStyle= this.ghost;
      }else{
        canvas.fillStyle="#FFFFFF";
      }
    }
    if(this.coin === 'green'){
      canvas.fillStyle="#00FF00";
    }
    if(this.coin === 'red'){
      canvas.fillStyle="#FF0000";
    }
    var padding = 5;
    canvas.fillRect(x + padding , y + padding, width - (padding * 2), height - (padding * 2));
  };


}
