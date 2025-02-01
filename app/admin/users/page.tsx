import { Metadata } from 'next';
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatId } from '@/lib/utils';
import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Users',
};
const AdminUserPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const { page = 1, query } = await searchParams;

  const users = await getAllUsers({ page: Number(page), query });
  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <h1 className='h2-bold'>Users</h1>
          {query && (
            <div>
              Filtered by <i>&quot;{query}&quot;</i>{' '}
              <Link href='/admin/users'>
                <Button variant='outline' size='sm'>
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead className='w-[100px]'>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data.map((u) => (
            <TableRow key={u.id} className='text-base'>
              <TableCell>{formatId(u.id)}</TableCell>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                {u.role === 'user' ? (
                  <Badge variant='secondary'>User</Badge>
                ) : (
                  <Badge variant='default'>Admin</Badge>
                )}
              </TableCell>
              <TableCell className='flex gap-1'>
                <Button asChild variant='outline' size='sm'>
                  <Link href={`/admin/users/${u.id}`}>Edit</Link>
                </Button>
                {/* DELETE */}
                <DeleteDialog id={u.id} action={deleteUser} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users?.totalPages > 1 && (
        <Pagination page={page} totalPages={users.totalPages} />
      )}
    </div>
  );
};
export default AdminUserPage;
