import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbkchartComponent } from './fbkchart.component';

describe('FbkchartComponent', () => {
  let component: FbkchartComponent;
  let fixture: ComponentFixture<FbkchartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FbkchartComponent]
    });
    fixture = TestBed.createComponent(FbkchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
