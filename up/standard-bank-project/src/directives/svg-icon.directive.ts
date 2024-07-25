import { NgModule, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'svg-icon',
    template: `<div #svgIcon></div>`
})
export class SvgIconDirectiveComponent implements OnInit {

    @Input() iconPath: any;
    @Input() baseDir: string;
    @Input() color: string;

    @ViewChild('svgIcon', { static: true }) svgIcon: ElementRef;

    constructor() { }

    ngOnInit() {

        const parser = new DOMParser();

        const svgElement = parser.parseFromString(this.iconPath, 'image/svg+xml').getElementsByTagName('svg')[0];
        svgElement.style.maxHeight = 'inherit';
        svgElement.style.maxWidth = 'inherit';
        svgElement.style.height = 'inherit';
        svgElement.style.width = 'inherit';
        if (this.color) {
            svgElement.style.fill = this.color;
        }

        this.svgIcon.nativeElement.appendChild(svgElement);

        // const url = (this.baseDir ? this.baseDir : 'assets/icons/') + this.iconPath;

        // const ajax = new XMLHttpRequest();
        // ajax.open('GET', url, true);
        // ajax.send();

        // ajax.onload = (e) => {
        //     const parser = new DOMParser();
        //     const ajaxdoc = parser.parseFromString(ajax.responseText, 'image/svg+xml');
        //     const svgElement = ajaxdoc.getElementsByTagName('svg')[0];
        //     svgElement.style.maxHeight = 'inherit';
        //     svgElement.style.maxWidth = 'inherit';
        //     svgElement.style.height = 'inherit';
        //     svgElement.style.width = 'inherit';
        //     if (this.color) {
        //         svgElement.style.fill = this.color;
        //     }
        //     this.svgIcon.nativeElement.appendChild(svgElement);
        // };

        this.svgIcon.nativeElement.style.maxHeight = 'inherit';
        this.svgIcon.nativeElement.style.maxWidth = 'inherit';
        this.svgIcon.nativeElement.style.height = 'inherit';
        this.svgIcon.nativeElement.style.width = 'inherit';
        this.svgIcon.nativeElement.style.position = 'relative';
        this.svgIcon.nativeElement.style.zIndex = '-1';
    }
}

@NgModule({
    declarations: [
        SvgIconDirectiveComponent
    ],
    exports: [
        SvgIconDirectiveComponent
    ]
})
export class SvgIconDirectiveModule { }
