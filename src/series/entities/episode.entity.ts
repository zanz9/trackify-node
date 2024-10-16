import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Series } from './series.entity';

@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  releaseDate: Date;

  @Column()
  numberEpisode: number;

  @Column()
  released: boolean;

  @ManyToOne(() => Series, (series) => series.episodes, { onDelete: 'CASCADE' })
  series: Series;
}
