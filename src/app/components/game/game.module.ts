import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-modal';
import { GameComponent } from './game.component';

import { CardModule } from '../card/card.module';
import { StorySnippetModule } from '../story-snippet/story-snippet.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, 
        ReactiveFormsModule,
        CardModule,
        ModalModule,
        StorySnippetModule
    ],
    declarations: [
        GameComponent
    ],
    exports: [
        GameComponent
    ]
})

export class GameModule {}
