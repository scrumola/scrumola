import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Params, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Player } from '../models/player.model';
import { getDetails } from '../utils/storage.utils';

import { Card } from '../models/card.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  public player: Player = new Player();
  public isOSIOReady = false;
  public emptyCards = true;

  private questionMarkColor = '#5e4a87';
  private passColor = '#5e5e5e';

  public cards: Array<Card> = [];
  private values: Array<number> = [];

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
  }

  ngOnInit() {
    this.emptyCards = true;
    this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const params = new URLSearchParams(s.url.split('?')[1]);
        const paramsMap: Map<string, string[]> = params.paramsMap;
        debugger;
        this.player.nickName = paramsMap.get('nickName')[0];
        this.player.playerType = paramsMap.get('playerType')[0];
        this.player.gameName = paramsMap.get('gameName')[0];

        this.initialize();
      }
    });
  }
}
