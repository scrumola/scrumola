import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Params, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Player } from '../models/player.model';
import { getDetails } from '../utils/storage.utils';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  public player: Player;
  public isOSIOReady = false;

  constructor(
    private router: Router,
    ) {
  }

  // findPlayerType(): void {
  //   // getDetails()
  // }


  ngOnInit() {
    this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const params = new URLSearchParams(s.url.split('?')[1]);
        const paramsMap: Map<string, string[]> = params.paramsMap;
        this.player.nickName = paramsMap.get('nickName')[0];
        this.player.playerType = paramsMap.get('playerType')[0];
        this.player.gameName = paramsMap.get('gameName')[0];
      }
    });
  }
}
