import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Params, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Player } from '../models/player.model';
import { getDetails, storeDetails } from '../utils/storage.utils';

import { Card } from '../models/card.model';
import { UserStory } from '../models/userstory.model'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  public player: Player = new Player();
  public userStoryInfo: UserStory = new UserStory();
  public isOSIOReady = false;
  public emptyCards = true;
  public isCreator = false;

  public estimatedCards: Array<Card> = [];

  private questionMarkColor = '#5e4a87';
  private passColor = '#5e5e5e';

  public cards: Array<Card> = [];
  private values: Array<number> = [];


  @ViewChild('userStoryModal') userStoryModal: any;

  constructor(
    private router: Router,
    ) {
  }

  // findPlayerType(): void {
  //   // getDetails()
  // }

  private fibonacci(limit: number): void {
    let f1 = 0, f2 = 1, current;
    for (let i = 0; i < limit; ) {
      current = f1;
      f1 = f2;
      f2 = f1 + current;
      if (this.values.indexOf(current) === -1) {
        this.values.push(current);
        ++ i;
      }
    }
  }

  // private sync(results: Array<any>): void {
  //   if (results && results.length > 0) {
  //     let resultsLen = results.length;
  //     for (let i = 0; i < resultsLen; ++ i) {
  //       if (!this.estimatedCards[i]) {
  //         this.estimatedCards.push(results[i]);
  //       }
  //     }
  //   }
  // }

  private getExistingEstimations(): Array<any> {
    const estimation: any = getDetails('estimation');
    let results: any = [];
    if (estimation) {
      results = JSON.parse(estimation);
    }
    return results;
  }

  private lookForEstimations(): void {
    window.setInterval(() => {
      this.estimatedCards = this.getExistingEstimations();
      this.emptyCards = true;
      if (this.estimatedCards && this.estimatedCards.length > 0) {
        this.emptyCards = false;
      }
    }, 2000);
  }

  private initialize(): void {
    this.fibonacci(10);
    for (let i = 0; i < 10; ++ i) {
      this.cards.push({
        value: this.values[i].toString(),
        color: (this.values[i] < 10 ? '#0466d2' : '#149c37'),
        status: 'show'
      });
    }
    this.cards.push({
      value: '?',
      color: this.questionMarkColor,
      status: 'show'
    });
    this.cards.push({
      value: 'Pass',
      color: this.passColor,
      status: 'show'
    });

    this.lookForEstimations();

    if (this.player.playerType === '0') {
      this.isCreator = true;
    } else {
      this.isCreator = false;
    }
  }

  ngOnInit() {
    this.emptyCards = true;
    this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const params = new URLSearchParams(s.url.split('?')[1]);
        const paramsMap: Map<string, string[]> = params.paramsMap;
        this.player.nickName = paramsMap.get('nickName')[0];
        this.player.playerType = paramsMap.get('playerType')[0];
        this.player.gameName = paramsMap.get('gameName')[0];

        this.initialize();
      }
    });
  }

  addNewUserStory() {
    this.userStoryModal.open();
  }

  public flipEstimates(): void {
    let estimations = this.getExistingEstimations();
    let len = estimations.length;
    for (let i = 0; i < len; ++ i) {
      let status: string = estimations[i].card.status;
      status = status === 'show' ? 'hide' : 'show';
      estimations[i].card.status = status;
    }
    storeDetails('estimation', JSON.stringify(estimations));
  }

  public handleCardClick(card: Card): void {
    if (this.player.playerType === '1') {
      const estimation: any = {
        "name": this.player.nickName,
        "card": {
          "value": card.value,
          "color": card.color,
          "status": 'hide',
          "playerName": this.player.nickName
        }
      };
      let existingEstimations: any = this.estimatedCards = this.getExistingEstimations();
      let len = existingEstimations.length;
      let flag = false;
      for (let i = 0; i < len; ++ i) {
        if (existingEstimations[i].name === this.player.nickName) {
          existingEstimations[i] = estimation;
          flag = true;
          break;
        }
      }
      if (!flag) {
        existingEstimations.push(estimation);
      }

      storeDetails('estimation', JSON.stringify(existingEstimations));
    }
  }
}
