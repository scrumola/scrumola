import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';

import { CardModule } from '../card/card.module';

@NgModule({
    imports: [
        CommonModule,
        CardModule
    ],
    declarations: [
        GameComponent
    ],
    exports: [
        GameComponent
    ]
})

export class GameModule {}
