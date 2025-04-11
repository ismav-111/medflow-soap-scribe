
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMedFlow } from '@/context/MedFlowContext';
import { CheckCircle, XCircle, FileText, Info, Plus, Edit, Trash2 } from 'lucide-react';
import { IcdReview as IcdReviewType } from '@/types';
import FeedbackDialog from './FeedbackDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const IcdReview = () => {
  const { 
    icdReviews, 
    provideFeedback, 
    isProcessing, 
    allIcdCodesApproved,
    addIcdReview,
    updateIcdReview,
    deleteIcdReview,
    selectedIcdCodes,
    toggleIcdCodeSelection,
    selectAllIcdCodes,
    setCurrentStep
  } = useMedFlow();
  
  const [selectedReview, setSelectedReview] = useState<IcdReviewType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editForm, setEditForm] = useState({
    id: '',
    term: '',
    title: '',
    icdCode: '',
    reasons: '',
    feedback: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected'
  });

  // Handle opening the review dialog
  const handleReviewClick = (review: IcdReviewType) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  // Handle opening the edit dialog
  const handleEditClick = (review: IcdReviewType) => {
    setEditForm(review);
    setIsEditing(true);
  };

  // Handle opening the delete confirmation
  const handleDeleteClick = (review: IcdReviewType) => {
    setSelectedReview(review);
    setIsDeleting(true);
  };

  // Handle opening the add new dialog
  const handleAddClick = () => {
    setEditForm({
      id: `icd-${Date.now()}`,
      term: '',
      title: '',
      icdCode: '',
      reasons: '',
      feedback: '',
      status: 'pending'
    });
    setIsAdding(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle save of edited item
  const handleSaveEdit = () => {
    updateIcdReview(editForm);
    setIsEditing(false);
  };

  // Handle adding new item
  const handleSaveAdd = () => {
    addIcdReview(editForm);
    setIsAdding(false);
  };

  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (selectedReview) {
      deleteIcdReview(selectedReview.id);
      setIsDeleting(false);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    const allSelected = selectedIcdCodes.length === icdReviews.length;
    selectAllIcdCodes(!allSelected);
  };

  // Handle completing the review and moving to next step
  const handleComplete = () => {
    setCurrentStep('complete');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="h-3 w-3 mr-1" /> Feedback</Badge>;
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-white/80 border border-gray-200 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-2xl font-semibold text-medical-700">
            Review ICD Codes
          </CardTitle>
          <CardDescription>
            Review and provide feedback on the generated ICD codes
          </CardDescription>
        </div>
        <Button 
          onClick={handleAddClick}
          className="bg-medical-600 hover:bg-medical-700"
          disabled={isProcessing}
        >
          <Plus className="h-4 w-4 mr-1" /> Add ICD Code
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border border-gray-100 mb-6">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-10 text-center">
                  <Checkbox 
                    id="select-all" 
                    checked={selectedIcdCodes.length === icdReviews.length && icdReviews.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-24 font-mono">Code</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-40 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {icdReviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-gray-50/80">
                  <TableCell className="text-center">
                    <Checkbox 
                      id={`review-${review.id}`}
                      checked={selectedIcdCodes.includes(review.id)}
                      onCheckedChange={() => toggleIcdCodeSelection(review.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-medical-700 font-medium">{review.icdCode}</TableCell>
                  <TableCell>{review.term}</TableCell>
                  <TableCell>{review.title}</TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReviewClick(review)}
                        disabled={isProcessing}
                        className="hover:bg-gray-100"
                      >
                        Review
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-gray-100"
                        title={review.reasons || review.feedback}
                      >
                        <Info className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-gray-100"
                        onClick={() => handleEditClick(review)}
                        disabled={isProcessing}
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-gray-100"
                        onClick={() => handleDeleteClick(review)}
                        disabled={isProcessing}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {icdReviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No ICD codes available. Add codes using the button above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex justify-center">
          <Button 
            className="bg-medical-600 hover:bg-medical-700 flex items-center gap-2"
            disabled={!allIcdCodesApproved}
            onClick={handleComplete}
          >
            <FileText className="h-4 w-4" />
            Generate Final Report
          </Button>
        </div>

        {selectedReview && (
          <FeedbackDialog 
            review={selectedReview}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={(feedback) => provideFeedback(selectedReview.id, feedback)}
          />
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit ICD Code</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icdCode" className="text-right">
                  ICD Code
                </Label>
                <Input
                  id="icdCode"
                  name="icdCode"
                  value={editForm.icdCode}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="term" className="text-right">
                  Term
                </Label>
                <Input
                  id="term"
                  name="term"
                  value={editForm.term}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reasons" className="text-right">
                  Reasons
                </Label>
                <Input
                  id="reasons"
                  name="reasons"
                  value={editForm.reasons}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add New Dialog */}
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New ICD Code</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icdCode" className="text-right">
                  ICD Code
                </Label>
                <Input
                  id="icdCode"
                  name="icdCode"
                  value={editForm.icdCode}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="term" className="text-right">
                  Term
                </Label>
                <Input
                  id="term"
                  name="term"
                  value={editForm.term}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reasons" className="text-right">
                  Reasons
                </Label>
                <Input
                  id="reasons"
                  name="reasons"
                  value={editForm.reasons}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={handleSaveAdd}>Add ICD Code</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              Are you sure you want to delete ICD code {selectedReview?.icdCode} for {selectedReview?.term}? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default IcdReview;
