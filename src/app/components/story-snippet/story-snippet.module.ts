import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { StorySnippetComponent } from './story-snippet.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        StorySnippetComponent
    ],
    exports: [
        StorySnippetComponent
    ]
})

export class StorySnippetModule {}
