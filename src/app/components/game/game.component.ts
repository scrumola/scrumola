import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
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

  public onLogin = new EventEmitter();

  public player: Player = new Player();
  public userStoryInfo: UserStory = new UserStory();
  public userStoryEntry: UserStory = new UserStory();
  public isOSIOReady = false;
  public emptyCards = true;
  public isCreator = false;

  public alreadyEstimated = false;
  public estimatedValue = '';
  public storySelected: UserStory = null;

  public estimatedCards: Array<Card> = [];

  private questionMarkColor = '#5e4a87';
  private passColor = '#5e5e5e';

  public cards: Array<Card> = [];
  public stories: Array<UserStory> = [];
  private values: Array<number> = [];

  private TIMER = 2000;


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

  private parseExisting(key: string): Array<any> {
    const existing: any = getDetails(key);
    let results: any = [];
    if (existing) {
      results = JSON.parse(existing);
    }
    return results;
  }

  public finalizeEstimates(estimate: any): void {
    if (estimate) {
      if (this.player.playerType === '0' && estimate.card && estimate.card.status === 'show') {
        
        this.userStoryInfo.acceptedEstimate = estimate.card.value;
        this.userStoryInfo.isEstimated = true;
        this.storeStories(this.userStoryInfo, true);
        this.alreadyEstimated = true;
        this.estimatedValue = this.userStoryInfo.acceptedEstimate;
      }
    }
  }

  private getExistingEstimations(): Array<any> {
    let overall: Array<any> = this.parseExisting(this.player.gameName);
    let estimates: Array<any> = [];
    if (overall && overall.length > 0) {
      overall.forEach((story) => {
        if (story.storyDetail === this.storySelected.storyDetail) {
          estimates = story.estimates;
        }
      });
    }
    return estimates;
  }

  private getExistingStories(): Array<any> {
    return this.parseExisting(this.player.gameName);
  }

  private lookForEstimations(): void {
    window.setInterval(() => {
      this.estimatedCards = this.getExistingEstimations();
      this.lookForStories();
      this.emptyCards = true;
      if (this.estimatedCards && this.estimatedCards.length > 0) {
        this.emptyCards = false;
      }
    }, this.TIMER);
  }

  private lookForStories(): void {
    this.stories = this.getExistingStories();
    this.checkCurrentStory();
  }

  private checkCurrentStory(): void {
    if (this.storySelected) {
      if (this.stories && this.stories.length > 0) {
        this.stories.forEach((story) => {
          if (story.storyDetail === this.storySelected.storyDetail) {
            this.storySelected = story;
            this.alreadyEstimated = this.storySelected.isEstimated;
            this.estimatedValue = this.storySelected.acceptedEstimate ? this.storySelected.acceptedEstimate : null;
          }
        });
      }
    }
  }

  addNewUserStory() {
    this.userStoryEntry = new UserStory();
    this.userStoryModal.open();
  }

  public closeModal(): void {
    this.userStoryModal.close();
  }

  private resetStory(): void {
    this.estimatedCards = [];
    this.alreadyEstimated = false;
    this.estimatedValue = null;
    this.emptyCards = true;
  }

  public selectedStory(story: UserStory): void {
    this.storySelected = story;
    this.userStoryInfo = story;
    this.resetStory();
    if (this.storySelected.isEstimated) {
      this.alreadyEstimated = true;
      this.estimatedValue = this.storySelected.acceptedEstimate;
    }
    this.lookForEstimations();
  }

  public storeStories(userStory: UserStory, amend?: boolean): void {
    
    let stories = this.getExistingStories() || [];
    if (stories) {
      if (amend) {
        let len = stories.length;
        for (let i = 0; i < len; ++ i) {
          if (stories[i].storyDetail === userStory.storyDetail) {
            stories[i].isEstimated = userStory.isEstimated;
            stories[i].acceptedEstimate = userStory.acceptedEstimate;
          }
        }
      }
      else {
        stories.push(userStory);
      }
      storeDetails(this.player.gameName, JSON.stringify(stories));
      this.lookForStories();
    }
  }

  public userStorySubmit(): void {
    
    if (this.userStoryEntry && this.userStoryEntry.hasOwnProperty('storyDetail')) {
      this.userStoryEntry.isEstimated = false;
      this.storeStories(this.userStoryEntry);
      this.closeModal();
    }
  }

  private submitEstimates(estimations: Array<any>): void {
    let stories: Array<UserStory> = this.getExistingStories();
    if (stories && stories.length > 0) {
      let len = stories.length;
      for (let i = 0; i < len; ++ i) {
        if (stories[i].storyDetail === this.userStoryInfo.storyDetail) {
          stories[i].estimates = estimations;
        }
      }
    }
    storeDetails(this.player.gameName, JSON.stringify(stories));
  }

  public flipEstimates(): void {
    let estimations = this.getExistingEstimations();
    if (estimations && estimations.length > 0) {
      let len = estimations.length;
      for (let i = 0; i < len; ++ i) {
        let status: string = estimations[i].card.status;
        status = status === 'show' ? 'hide' : 'show';
        estimations[i].card.status = status;
      }
      this.submitEstimates(estimations);
    }
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
      let existingEstimations: any = this.getExistingEstimations() || [];
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

      this.userStoryInfo.estimates = existingEstimations;

      this.submitEstimates(existingEstimations);
    }
  }

  public isSelected(card: Card): any {
    if (card) {
      const estimations = this.getExistingEstimations();
      if (estimations && estimations.length > 0) {
        const len = estimations.length;
        let value = '';
        for (let i = 0; i < len; ++ i) {
          value = estimations[i].card.value;
          if (this.player.nickName === estimations[i].name) {
            return card.value === value;
          }
        }
      }
    }
    return false;
  }

  private initialize(): void {
    window.setInterval(() => {
      this.lookForStories();
    }, this.TIMER);
    this.fibonacci(10);
    for (let i = 0; i < 10; ++ i) {
      this.cards.push({
        value: this.values[i].toString(),
        color: (this.values[i] < 10 ? '#337ab7' : '#149c37'),
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
        this.onLogin.next(this.player);
        this.initialize();
      }
    });
  }

}
