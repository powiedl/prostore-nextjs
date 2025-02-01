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
  modification: {
    heading: string;
    detail?: string;
  };
  date?: string | Date;
  status: 'TODO' | 'IN PROGRESS' | 'DONE' | 'OBSOLETE';
}[] = [
  {
    modification: {
      heading: 'Admin - Overview',
      detail: 'The cards at the top are links to the coresponding details page',
    },
    date: '01/2025',
    status: 'DONE',
  },
  {
    modification: {
      heading: 'pagination',
      detail:
        ' The pagination component also includes first and last page (not only prev and next)',
    },
    date: '01/2025',
    status: 'DONE',
  },
  {
    modification: {
      heading: 'order table',
      detail:
        'Use the same shared component OrderTable in user and admin context',
    },
    date: '01/2025',
    status: 'DONE',
  },
  {
    modification: {
      heading: 'categories',
      detail:
        'Categories should be "fixed" values from the database - and abiltity to modify the categories as an admin',
    },
    status: 'TODO',
  },
  {
    modification: {
      heading: 'product search sidebar',
      detail:
        'The different filters should be collapseable (and if one is collapsed, the current value should be beside the heading)',
    },
    status: 'DONE',
    date: '02/2025',
  },
  {
    modification: {
      heading: 'product search pagination',
      detail:
        'Added pagination to the search page (was a little tricky, because if you sharpen the filter there might not be enough products for the current page',
    },
    status: 'DONE',
    date: '02/2025',
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
              key={i.modification.heading + i.modification.detail}
              className={cn(
                'rounded-lg border-spacing-y-2 border-spacing-x-0',
                i.status === 'DONE'
                  ? 'bg-green-200 hover:bg-green-300'
                  : i.status === 'OBSOLETE'
                  ? 'bg-gray-200 hover:bg-gray-300'
                  : i.status === 'IN PROGRESS'
                  ? 'bg-yellow-200 hover:bg-yellow-300'
                  : ''
              )}
            >
              <TableCell>
                <span className='font-semibold mr-2 capitalize'>
                  {i.modification.heading}
                </span>
                {i.modification?.detail}
              </TableCell>
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
