/*
  Hero and Monster class 的基礎 class
*/
class BaseCharacter {
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }

  isAlive() {
    return this.alive;
  }

  attack(character,damage) {
    if (this.isAlive() == false) return;
    console.log("攻擊 " + character.name + " 造成 " + damage + " 傷害");
    character.getHurt(damage)
  }

  die() {
    this.alive = false;
  }

  getHurt(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }
    
    var _this = this;
    var i = 1;

    _this.timeInterval = setInterval(function() {
      //設定受攻擊動畫
      _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i +'.png';
      _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
      _this.element.getElementsByClassName("hurt-text")[0].innerHTML = damage;
      i++;

      if (i > 7) {
        //移除受攻擊動畫
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].innerHTML = "";
        clearInterval(_this.timeInterval);
      }
    }, 50);
  }

  updateHtml(hpElement, hurtElement) {
    //更新血量文字與血條
    hpElement.innerHTML = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%"
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    //取得角色html
    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp
    this.maxHpElement.textContent = this.maxHp

    console.log("遇到怪獸 " + this.name + " 了！");
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2.0) + (this.ap / 2.0)
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage)
    this.updateHtml(this.hpElement, this.hurtElement)
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    //取得角色html
    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");
    this.maxHpElement = document.getElementById("hero-max-hp");

    this.hpElement.textContent = this.hp
    this.maxHpElement.textContent = this.maxHp

    console.log("你的英雄" + this.name + "已經誕生了！");
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2.0) + (this.ap / 2.0)
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage)
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}


var hero = new Hero("Bernard", 100, 30);
var monster = new Monster("Skeleton", 60, 10);
var rounds = 10;

function isGameOver() {
  //更新回合數，並檢查是否回合結束
  rounds--;
  var roundElement = document.getElementById("round-num");
  roundElement.innerHTML = rounds;

  return (rounds == 0 || !hero.isAlive() || !monster.isAlive());
}

function finish() {
  //P5 顯示dialog
  var dialog = document.getElementById("dialog")
  dialog.style.display = "block";
  if (monster.isAlive() == false) {
    dialog.classList.add("win")
  } else if (hero.isAlive() == false) {
    dialog.classList.add("lose")
  }
}

function heroAttack(i) {
  // Hero 選技能時觸發回合開始
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function() {
    // Hero 攻擊
    // Hero 移動動畫
    hero.element.classList.add("attacking");
    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100)

  setTimeout(function() {
    // Monster 攻擊
    // Monster 移動動畫
    if (monster.isAlive()){
      monster.element.classList.add("attacking")
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        //monster 攻擊完檢查是否回合結束
        if (isGameOver() == true) {
          finish();
        } else {
          //新回合打開Hero skill
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      //Monster 陣亡
      finish();
    }
  }, 1000)

}

function addSkillEvent() {
  // 設定技能事件驅動
  var skill1 = document.getElementById("skill1");
  skill1.onclick = function() { heroAttack(); }
}

addSkillEvent();
