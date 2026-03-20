import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberBackgroundComponent } from './cyber-background';

describe('CyberBackground', () => {
  let component: CyberBackgroundComponent;
  let fixture: ComponentFixture<CyberBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CyberBackgroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CyberBackgroundComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
