import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const infos: {
  modification: string;
  date?: string | Date;
  status: 'TODO' | 'INPROGRESS' | 'DONE' | 'OBSOLETE';
}[] = [
  {
    modification:
      'Admin - Overview: The cards at the top are links to the coresponding details page',
    date: 'During the course',
    status: 'DONE',
  },
  {
    modification:
      ' The pagination component also includes first and last page (not only prev and next)',
    date: 'During the course',
    status: 'DONE',
  },
  {
    modification:
      'Use the same shared component OrderTable in user and admin context',
    date: 'During the course',
    status: 'DONE',
  },
  {
    modification:
      'Categories should be &quot;fixed&quot; values from the database - and abiltity to modify the categories as an admin',
    status: 'TODO',
  },
];

const AboutPage = () => {
  return (
    <div>
      <h2 className='font-semibold text-2xl'>My additions / modifications</h2>
      <Table className='about-table border-separate'>
        <TableHeader>
          <TableRow>
            <TableHead>MODIFICATION</TableHead>
            <TableHead>DATE</TableHead>
            <TableHead className='text-center'>STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {infos.map((i) => (
            <TableRow
              key={i.modification}
              className={cn(
                'rounded-lg border-spacing-y-2 border-spacing-x-0',
                i.status === 'DONE'
                  ? 'bg-green-200 hover:bg-green-300'
                  : i.status === 'OBSOLETE'
                  ? 'bg-red-200 hover:bg-red-300'
                  : ''
              )}
            >
              <TableCell>{i.modification}</TableCell>
              <TableCell>{i.date?.toString()}</TableCell>
              <TableCell className='text-center'>{i.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default AboutPage;
