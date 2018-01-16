"use strict";

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

  attack(character,damage) {
    if (this.alive == false) return;
    //console.log("攻擊 " + character.name + " 造成 " + damage + " 傷害");
    character.getHurt(damage);
  }

  getHurt(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }
    
    var _this = this;
    var i = 1;

    _this.id = setInterval(function() {
      //設定受攻擊動畫
      _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i +'.png';
      _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
      _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      i++;

      if (i > 9) {
        //移除受攻擊動畫
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    }, 50);
  }

  die() {
    this.alive = false;
  }

  updateHtml(hpElement, hurtElement) {
    //更新血量文字與血條
    hpElement.textContent = this.hp;
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
    super.getHurt(damage);
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

    console.log("召喚英雄 " + this.name + "！");
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2)
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage);
    super.updateHtml(this.hpElement, this.hurtElement);
  }
}

var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 10);
var rounds = 10;

function endTurn() {
  //更新回合數，並檢查是否回合結束
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if(rounds < 1) {
    finish();
  }
}

function finish() {
  //顯示 dialog
  var dialog = document.getElementById("dialog")
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}

function heroAttack() {
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
  }, 100);

  setTimeout(function() {
    // Monster 攻擊
    // Monster 移動動畫
    if (monster.alive){
      monster.element.classList.add("attacking")
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        //monster 攻擊完檢查是否回合結束
        endTurn();
        if (hero.alive == false) {
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
  }, 1100);
}

function addSkillEvent() {
  // 設定技能事件驅動damage
  var skill = document.getElementById("skill");
  skill.onclick = function() { heroAttack(); }
}

addSkillEvent();
